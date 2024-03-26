import Cell from "@/model/cell";
import BaseModule from "@/module/base.module";
import { MESSAGE, WRAP_SHEETS } from "@/util/global";

export default class TableManager extends BaseModule {
  copyCell: Cell | null = null;
  selected: Cell[] = [];
  options: Partial<CSSStyleDeclaration> = {
    tableLayout: "auto",
    borderCollapse: "collapse",
  };

  private table!: HTMLTableElement;
  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;
  private head: Cell[][] = [];
  private body: Cell[][] = [];

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
    // this.thead.style.cssText = `border-bottom: 3px solid #565656`;

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

  selectAllCells() {
    this.selected = [];
    this.head
      .flat(1)
      .concat(this.body.flat(1))
      .forEach((cell) => {
        this.selectCell(cell);
      });
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
    if (
      Object.keys(this.dependencies.StorageManager.storages.options).length ===
      0
    ) {
      this.dependencies.StorageManager.storages.options = this.options;
    }

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
  }

  private setupHeads() {
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
    if (
      Object.keys(this.dependencies.StorageManager.storages.options).length > 0
    ) {
      this.options = this.dependencies.StorageManager.storages.options;
    }
    this.setupTable();
    this.saveTable();
    this.initSelected();
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

  getColumnBy(xIndex: number) {
    const temp: Cell[] = [];
    this.head.forEach((row) => {
      temp.push(row[xIndex]);
    });
    this.body.forEach((row) => {
      temp.push(row[xIndex]);
    });
    return temp;
  }

  getHeadRowBy(yIndex: number) {
    const temp: Cell[] = [];
    temp.push(...this.head[yIndex]);
    return temp;
  }

  getBodyRowBy(yIndex: number) {
    const temp: Cell[] = [];
    temp.push(...this.body[yIndex]);
    return temp;
  }

  /* Add tools */
  addColumnLeftSide() {
    const lastOne = this.selected[this.selected.length - 1];
    if (!lastOne) {
      this.logger.error("not selected cell");
      alert(MESSAGE.NO_SELECTED_CELL);
      return;
    }
    const cellPosX = lastOne.x;
    const leftSideIndex = cellPosX - 1 > 0 ? cellPosX - 1 : 0;
    this.addColumn(leftSideIndex);
  }

  addColumnRightSide() {
    const lastOne = this.selected[this.selected.length - 1];
    if (!lastOne) {
      this.logger.error("not selected cell");
      alert(MESSAGE.NO_SELECTED_CELL);
      return;
    }
    const cellPosX = lastOne.x;
    const RightSideIndex = cellPosX + 1;
    this.addColumn(RightSideIndex);
  }

  addColumn(index: number) {
    this.head.forEach((head, y) => {
      head.splice(index, 0, new Cell(index, y, "th"));
    });
    this.body.forEach((body, y) => {
      body.splice(index, 0, new Cell(index, y, "td"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addBeforeColumn() {
    this.head.forEach((head, y) => {
      head.unshift(new Cell(0, y, "th"));
    });
    this.body.forEach((body, y) => {
      body.unshift(new Cell(0, y, "td"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addAfterColumn() {
    this.head.forEach((head, y) => {
      head.push(new Cell(head.length, y, "th"));
    });
    this.body.forEach((body, y) => {
      body.push(new Cell(body.length, y, "td"));
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowTop() {
    const lastOne = this.selected[this.selected.length - 1];
    if (!lastOne) {
      this.logger.error("not selected cell");
      alert(MESSAGE.NO_SELECTED_CELL);
      return;
    }
    const cellPosY = lastOne.y;
    const type = lastOne.type;
    const topSideIndex = cellPosY - 1 > 0 ? cellPosY - 1 : 0;
    this.addRow(topSideIndex, type);
  }

  addRowBottom() {
    const lastOne = this.selected[this.selected.length - 1];
    if (!lastOne) {
      this.logger.error("not selected cell");
      alert(MESSAGE.NO_SELECTED_CELL);
      return;
    }
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
        (_, i) => new Cell(i, index, "th")
      )
    );
  }

  addRowBody(index: number) {
    this.body.splice(
      index,
      0,
      [...new Array(this.body[0].length)].map(
        (_, i) => new Cell(i, index, "td")
      )
    );
  }

  addRowHeadTop() {
    this.head.splice(
      0,
      0,
      [...new Array(this.head[0].length)].map((_, i) => new Cell(i, 0, "th"))
    );
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowHeadBottom() {
    this.head.push(
      [...new Array(this.head[this.head.length - 1].length)].map(
        (_, i) => new Cell(i, this.head.length, "th")
      )
    );
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowBodyTop() {
    this.body.splice(
      0,
      0,
      [...new Array(this.body[0].length)].map((_, i) => new Cell(i, 0, "td"))
    );
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  addRowBodyBottom() {
    this.body.push(
      [...new Array(this.body[this.body.length - 1].length)].map(
        (_, i) => new Cell(i, this.body.length, "td")
      )
    );
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  /* Remove tools */
  removeContent() {
    this.selected.forEach((cell) => {
      cell.content = "";
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  removeStyle() {
    this.selected.forEach((cell) => {
      cell.style = {};
    });
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  removeRow() {
    const deniedMsg = new Set<string>();
    const rowSet = this.selected.reduce(
      (acc, cell) => {
        if (!(cell.type in acc)) {
          acc[cell.type] = new Set();
        }
        acc[cell.type].add(cell.y);
        return acc;
      },
      {} as {
        [k: string]: Set<number>;
      }
    );
    if ("th" in rowSet) {
      if (this.head.length > 1 && rowSet.th.size < this.head.length) {
        const sorted = [...rowSet.th].toSorted((a, b) => a - b);
        let count = 0;
        for (const row of sorted) {
          this.head.splice(row - count, 1);
          count += 1;
        }
        this.logger.check("processed: (deleted header row amount) " + count);
      } else {
        deniedMsg.add("헤드");
      }
    }
    if ("td" in rowSet) {
      if (this.body.length > 1 && rowSet.td.size < this.body.length) {
        const sorted = [...rowSet.td].toSorted((a, b) => a - b);
        let count = 0;
        for (const row of sorted) {
          this.body.splice(row - count, 1);
          count += 1;
        }
        this.logger.check("processed: (deleted body row amount) " + count);
      } else {
        deniedMsg.add("바디");
      }
    }
    if (deniedMsg.size > 0) {
      alert(`[${[...deniedMsg].join(", ")}]: ` + MESSAGE.REMOVE_COLUMN_DENIED);
    }
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  removeColumn() {
    const columnSet = this.selected.reduce(
      (acc, cell) => acc.add(cell.x),
      new Set<number>()
    );
    if (this.head[0].length > 1 && this.body[0].length > 1) {
      columnSet.forEach((x) => {
        this.head.forEach((row) => {
          row.splice(x, 1);
        });
        this.body.forEach((row) => {
          row.splice(x, 1);
        });
      });
    } else {
      alert(MESSAGE.REMOVE_COLUMN_DENIED);
    }
    this.sortingPosition();
    this.saveTable();
    this.update();
  }

  /* Get tools */
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

  /* Cell concat split tools */
  concatAll() {
    const min = this.getSelectedMinCell();
    const max = this.getSelectedMaxCell();
    if (!min && !max) {
      alert(MESSAGE.NO_SELECTED_CELL);
    }
    if (min?.type !== max?.type) {
      alert(MESSAGE.CANT_CONCAT);
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

  splitCell() {
    const min = this.getSelectedMinCell();
    const max = this.getSelectedMaxCell();
    if (!min && !max) {
      alert(MESSAGE.NO_SELECTED_CELL);
    }
    if (min?.type !== max?.type) {
      alert(MESSAGE.CANT_SPLIT);
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

  /* Table layout tools */
  tableLayoutFixed() {
    this.options.tableLayout = "fixed";
    this.saveTable();
    this.update();
  }

  tableLayoutAuto() {
    this.options.tableLayout = "auto";
    this.saveTable();
    this.update();
  }

  /* Draw border tools */
  drawBorderTop() {
    const dir = this.selected.every((cell) => cell.hasBorder("top"));
    for (const cell of this.selected) {
      if (dir) {
        cell.removeStyle("borderTopWidth");
        cell.removeStyle("borderTopStyle");
        cell.removeStyle("borderTopColor");
      } else {
        cell.style.borderTopWidth = "1px";
        cell.style.borderTopStyle = "solid";
        cell.style.borderTopColor = "black";
      }
    }
  }
  drawBorderBottom() {
    const dir = this.selected.every((cell) => cell.hasBorder("bottom"));
    for (const cell of this.selected) {
      if (dir) {
        cell.removeStyle("borderBottomWidth");
        cell.removeStyle("borderBottomStyle");
        cell.removeStyle("borderBottomColor");
      } else {
        cell.style.borderBottomWidth = "1px";
        cell.style.borderBottomStyle = "solid";
        cell.style.borderBottomColor = "black";
      }
    }
  }
  drawBorderLeft() {
    const dir = this.selected.every((cell) => cell.hasBorder("left"));
    for (const cell of this.selected) {
      if (dir) {
        cell.removeStyle("borderLeftWidth");
        cell.removeStyle("borderLeftStyle");
        cell.removeStyle("borderLeftColor");
      } else {
        cell.style.borderLeftWidth = "1px";
        cell.style.borderLeftStyle = "solid";
        cell.style.borderLeftColor = "black";
      }
    }
  }
  drawBorderRight() {
    const dir = this.selected.every((cell) => cell.hasBorder("right"));
    for (const cell of this.selected) {
      if (dir) {
        cell.removeStyle("borderRightWidth");
        cell.removeStyle("borderRightStyle");
        cell.removeStyle("borderRightColor");
      } else {
        cell.style.borderRightWidth = "1px";
        cell.style.borderRightStyle = "solid";
        cell.style.borderRightColor = "black";
      }
    }
  }
  drawBorderAll() {
    const dir = this.selected.every(
      (cell) =>
        cell.hasBorder("top") &&
        cell.hasBorder("bottom") &&
        cell.hasBorder("left") &&
        cell.hasBorder("right")
    );
    for (const cell of this.selected) {
      if (dir) {
        cell.removeStyle("borderTopWidth");
        cell.removeStyle("borderTopStyle");
        cell.removeStyle("borderTopColor");
        cell.removeStyle("borderBottomWidth");
        cell.removeStyle("borderBottomStyle");
        cell.removeStyle("borderBottomColor");
        cell.removeStyle("borderLeftWidth");
        cell.removeStyle("borderLeftStyle");
        cell.removeStyle("borderLeftColor");
        cell.removeStyle("borderRightWidth");
        cell.removeStyle("borderRightStyle");
        cell.removeStyle("borderRightColor");
      } else {
        cell.style.borderTopWidth = "1px";
        cell.style.borderTopStyle = "solid";
        cell.style.borderTopColor = "black";
        cell.style.borderBottomWidth = "1px";
        cell.style.borderBottomStyle = "solid";
        cell.style.borderBottomColor = "black";
        cell.style.borderLeftWidth = "1px";
        cell.style.borderLeftStyle = "solid";
        cell.style.borderLeftColor = "black";
        cell.style.borderRightWidth = "1px";
        cell.style.borderRightStyle = "solid";
        cell.style.borderRightColor = "black";
      }
    }
  }
}
