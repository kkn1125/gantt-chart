import Cell from "@/model/cell";
import BaseModule from "@/module/base.module";
import { WRAP_SHEETS } from "@/util/global";

export default class TableManager extends BaseModule {
  selected: Cell[] = [];

  private table!: HTMLTableElement;
  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;
  private head: Cell[][] = [];
  private body: Cell[][] = [];
  private options: Partial<CSSStyleDeclaration> = {
    tableLayout: "auto",
    borderCollapse: "collapse",
  };

  constructor() {
    super();
  }

  getCells() {
    return ([] as Cell[]).concat(...this.head, ...this.body);
  }

  setupTable() {
    this.table = this.createEl("table") as HTMLTableElement;
    this.thead = this.createEl("thead") as HTMLTableSectionElement;
    this.tbody = this.createEl("tbody") as HTMLTableSectionElement;
    this.table.append(this.thead, this.tbody);
    this.thead.style.cssText = `border-bottom: 3px solid #565656`;

    Object.entries(this.options).forEach((keyValue) => {
      const [k, v] = keyValue;
      if (k in this.table.style) {
        Object.assign(this.table.style, { [k]: v });
      }
    });

    WRAP_SHEETS.innerHTML = "";
    WRAP_SHEETS.append(this.table);

    this.loadTable();
    this.uploadSelected();
    this.setupHeads();
    this.setupBodies();
  }

  selectCell(cell: Cell) {
    if (!this.hasSelected(cell)) {
      cell.selected = true;
      this.selected.push(cell);
    }
  }

  swapSheet(sheetId: number) {
    this.dependencies.StorageManager.setCurrentSheetNumber(sheetId);
    this.dependencies.Ui.render();
  }

  update() {
    this.setupTable();
    this.saveTable();
  }

  hasSelected(cell: Cell) {
    return this.selected.includes(cell);
  }

  initSelected() {
    document.querySelectorAll(`[selected]`).forEach((cell) => {
      cell.removeAttribute("selected");
      const { posX, posY } = (cell as HTMLTableCellElement).dataset;
      if (posX && posY) {
        const cell = this.findCellByPos(+posX, +posY);
        if (cell) {
          cell.selected = false;
        }
      }
    });
    this.selected = [];
    // this.saveTable();
    // this.update();
  }

  private setupHeads() {
    //   "check cell 1",
    //   this.dependencies.StorageManager.storages.sheets[0].content.head[0][0]
    //     .content
    // );
    //   "check cell 2",
    //   this.dependencies.StorageManager.storages.sheets[1].content.head[0][0]
    //     .content
    // );

    for (let y = 0; y < this.head.length; y++) {
      const tr = this.createEl("tr");
      tr.dataset.row = "" + y;
      for (let x = 0; x < this.head[y].length; x++) {
        const th = this.head[y][x].render();
        th.dataset.posX = "" + x;
        th.dataset.posY = "" + y;
        tr.append(th);
      }
      this.thead.append(tr);
    }
  }

  private setupBodies() {
    for (let y = 0; y < this.body.length; y++) {
      const tr = this.createEl("tr");
      tr.dataset.row = "" + y;
      for (let x = 0; x < this.body[y].length; x++) {
        const td = this.body[y][x].render();
        td.dataset.posX = "" + x;
        td.dataset.posY = "" + (this.head.length + y);
        tr.append(td);
      }
      this.tbody.append(tr);
    }
  }

  highlightSelectedCells() {
    const first = this.selected.at(0);
    const last = this.selected.at(-1);

    if (first && last) {
      if (first === last) {
        first.selected = true;
        last.selected = true;
        document
          .querySelector(
            `.cell[data-pos-x="${first.posX}"][data-pos-y="${first.posY}"]`
          )
          ?.setAttribute("selected", "");
      } else {
        const minX = Math.min(first.posX, last.posX);
        const maxX = Math.max(first.posX, last.posX);
        const minY = Math.min(first.posY, last.posY);
        const maxY = Math.max(first.posY, last.posY);
        // selected 수정
        ([] as Cell[])
          .concat(...this.head)
          .concat(...this.body)
          .forEach((cell) => {
            if (
              minY <= cell.posY &&
              cell.posY <= maxY &&
              minX <= cell.posX &&
              cell.posX <= maxX
            ) {
              /* ... 범위 선택 시 컬러 설정 1회 적용되는 버그 이부분 문제 */
              if (!this.hasSelected(cell)) {
                this.selectCell(cell);
              }
              // cell.selected = true;
              document
                .querySelector(
                  `.cell[data-pos-x="${cell.posX}"][data-pos-y="${cell.posY}"]`
                )
                ?.setAttribute("selected", "");
            }
          });
      }
    }
  }

  saveTable() {
    this.sortingPosition();
    this.dependencies.StorageManager.addOption = this.options;
    this.dependencies.StorageManager.saveStorage();
  }

  loadTable() {
    this.head = [];
    this.body = [];
    const storageManager = this.dependencies.StorageManager;
    const sheet = storageManager.findSheet(storageManager.sheetNumber);
    if (sheet) {
      this.head = sheet.content.head;
      this.body = sheet.content.body;
    }

    this.sortingPosition();
  }

  uploadSelected() {
    this.selected = [];
    ([] as Cell[]).concat(...this.head, ...this.body).forEach((cell) => {
      if (cell.selected) {
        this.selected.push(cell);
      }
    });
  }

  initialize() {
    this.setupTable();
    this.options = this.dependencies.StorageManager.storages.options;
    this.saveTable();
    // this.initSelected();
  }

  findCellById(id: number, type: string) {
    if (type === "th") {
      return this.head.flat(1).find((cell) => cell.id === id);
    } else if (type === "td") {
      return this.body.flat(1).find((cell) => cell.id === id);
    } else {
      return undefined;
    }
  }

  findCellByPos(posX: number, posY: number) {
    return ([] as Cell[])
      .concat(...this.head, ...this.body)
      .find((cell) => cell.posX === posX && cell.posY === posY);
  }

  sortingPosition() {
    this.head.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.id = x + row.length * y;
        cell.x = x;
        cell.y = y;
        cell.posX = x;
        cell.posY = y;
      });
    });
    this.body.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.id = x + y * row.length + this.head.length * this.head[0].length;
        cell.x = x;
        cell.y = y;
        cell.posX = x;
        cell.posY = this.head.length + y;
      });
    });
  }

  addColumnLeftSide() {
    const lastOne = this.selected[this.selected.length - 1];
    const cellPosX = lastOne.x;
    const leftSideIndex = cellPosX - 1 > 0 ? cellPosX - 1 : 0;
    this.addColumn(leftSideIndex);
  }

  addColumnRightSide() {
    const lastOne = this.selected[this.selected.length - 1];
    const cellPosX = lastOne.x;
    const RightSideIndex = cellPosX + 1;
    this.addColumn(RightSideIndex);
  }

  addColumn(index: number) {
    this.head.forEach((head, y) => {
      head.splice(index, 0, new Cell(index, y, "th", "add"));
    });
    this.body.forEach((body, y) => {
      body.splice(index, 0, new Cell(index, y, "td", "add"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addBeforeColumn() {
    this.head.forEach((head, y) => {
      head.unshift(new Cell(0, y, "th", "before"));
    });
    this.body.forEach((body, y) => {
      body.unshift(new Cell(0, y, "td", "before"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addAfterColumn() {
    this.head.forEach((head, y) => {
      head.push(new Cell(head.length, y, "th", "after"));
    });
    this.body.forEach((body, y) => {
      body.push(new Cell(body.length, y, "td", "after"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowTop() {
    const lastOne = this.selected[this.selected.length - 1];
    const cellPosY = lastOne.y;
    const type = lastOne.type;
    const topSideIndex = cellPosY - 1 > 0 ? cellPosY - 1 : 0;
    this.addRow(topSideIndex, type);
  }

  addRowBottom() {
    const lastOne = this.selected[this.selected.length - 1];
    const cellPosY = lastOne.y;
    const type = lastOne.type;
    const bottomSideIndex = cellPosY + 1;
    this.addRow(bottomSideIndex, type);
  }

  addRow(index: number, type: "th" | "td") {
    if (type === "th") {
      this.addRowHead(index);
    } else {
      this.addRowBody(index);
    }
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowHead(index: number) {
    this.head.splice(
      index,
      0,
      [...new Array(this.head[0].length)].map(
        (_, i) => new Cell(i, index, "th", "add row head")
      )
    );
  }

  addRowBody(index: number) {
    this.body.splice(
      index,
      0,
      [...new Array(this.body[0].length)].map(
        (_, i) => new Cell(i, index, "td", "add row head")
      )
    );
  }

  addRowHeadTop() {
    this.head.splice(
      0,
      0,
      [...new Array(this.head[0].length)].map(
        (_, i) => new Cell(i, 0, "th", "top")
      )
    );
    this.sortingPosition();
    this.saveTable();
  }

  addRowHeadBottom() {
    this.head.push(
      [...new Array(this.head[this.head.length - 1].length)].map(
        (_, i) => new Cell(i, this.head.length, "th", "bottom")
      )
    );
    this.sortingPosition();
    this.saveTable();
  }

  addRowBodyTop() {
    this.body.splice(
      0,
      0,
      [...new Array(this.body[0].length)].map(
        (_, i) => new Cell(i, 0, "td", "top")
      )
    );
    this.sortingPosition();
    this.saveTable();
  }

  addRowBodyBottom() {
    this.body.push(
      [...new Array(this.body[this.body.length - 1].length)].map(
        (_, i) => new Cell(i, this.body.length, "td", "bottom")
      )
    );
    this.sortingPosition();
    this.saveTable();
  }

  getSelectedMinCell(): Cell | null {
    let minX = Infinity;
    let minY = Infinity;
    let min = null;
    this.selected.forEach((cell) => {
      if (cell.posX < minX || cell.posY < minY) {
        minX = cell.posX;
        minY = cell.posY;
        min = cell;
      }
    });

    return min;
  }

  getSelectedMaxCell(): Cell | null {
    let maxX = 0;
    let maxY = 0;
    let max = null;
    this.selected.forEach((cell) => {
      if (cell.posX > maxX || cell.posY > maxY) {
        maxX = cell.posX;
        maxY = cell.posY;
        max = cell;
      }
    });
    return max;
  }
  getSelectedAsGroup() {
    const groups: Cell[][] = [];
    for (let i = 0; i < this.selected.length; i++) {
      if (groups.length === 0) {
        groups.push([this.selected[i]]);
        continue;
      }

      const cur = this.selected[i];
      const next = this.selected[i + 1];

      if (next) {
        if (
          cur.id + 1 === next.id ||
          cur.id + this[cur.type === "th" ? "head" : "body"][0].length ===
            next.id
        ) {
          groups[groups.length - 1].push(cur, next);
        }
      }
    }
    return groups;
  }

  concatAll() {
    const min = this.getSelectedMinCell();
    const max = this.getSelectedMaxCell();
    if (min?.type !== max?.type) {
      alert("thead와 tbody는 혼합 할 수 없습니다.");
      return false;
    }

    if (min && max) {
      const workArea = this[min.type === "th" ? "head" : "body"];
      const col = max.posX - min.posX + 1;
      const row = max.posY - min.posY + 1;

      min.option.colSpan = col;
      min.option.rowSpan = row;

      // 1 ~ 2
      // 1 ~ 2
      for (let r = min.y; r <= min.y + row - 1; r++) {
        for (let c = min.x; c <= min.x + col - 1; c++) {
          if (r === min.y && c === min.x) {
            workArea[r][c].option.colSpan = col;
            workArea[r][c].option.rowSpan = row;
          } else {
            workArea[r][c].option.hidden = true;
          }
        }
      }

      // Object.assign(min.option, {
      //   colSpan: col,
      //   rowSpan: row,
      // });
    }
    this.saveTable();
    this.update();
  }

  tableLayoutFixed() {
    this.options.tableLayout = "fixed";
  }

  tableLayoutAuto() {
    this.options.tableLayout = "auto";
  }

  splitCell() {
    const min = this.getSelectedMinCell();
    const max = this.getSelectedMaxCell();

    if (min?.type !== max?.type) {
      alert("thead와 tbody는 따로 분해 해야합니다.");
      return false;
    }

    if (min && max) {
      if (min === max) {
        const workArea = this[min.type === "th" ? "head" : "body"];
        const col = min.option.colSpan as number;
        const row = min.option.rowSpan as number;

        for (let r = min.y; r <= min.y + row - 1; r++) {
          for (let c = min.x; c <= min.x + col - 1; c++) {
            workArea[r][c].option = {};
          }
        }
      } else {
        const workArea = this[min.type === "th" ? "head" : "body"];
        const col = max.posX - min.posX + 1;
        const row = max.posY - min.posY + 1;

        min.option.colSpan = col;
        min.option.rowSpan = col;

        // 1 ~ 2
        // 1 ~ 2
        for (let r = min.y; r <= min.y + row - 1; r++) {
          for (let c = min.x; c <= min.x + col - 1; c++) {
            workArea[r][c].option = {};
          }
        }
      }
    }
    this.saveTable();
    this.update();
  }
}
