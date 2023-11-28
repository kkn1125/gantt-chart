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

  constructor() {
    super();
  }

  setupTable() {
    this.table = this.createEl("table") as HTMLTableElement;
    this.thead = this.createEl("thead") as HTMLTableSectionElement;
    this.tbody = this.createEl("tbody") as HTMLTableSectionElement;
    this.table.append(this.thead, this.tbody);
    this.table.style.cssText = `table-layout: auto;border-collapse: collapse;`;
    this.thead.style.cssText = `border-bottom: 3px solid #565656`;
    WRAP_SHEETS.innerHTML = "";
    WRAP_SHEETS.append(this.table);

    this.loadTable();
    this.uploadSelected();
    this.setupHeads();
    this.setupBodies();
  }

  swapSheet(sheetId: number) {
    this.dependencies.StorageManager.setCurrentSheetNumber(sheetId);
    this.dependencies.Ui.render();
  }

  update() {
    this.setupTable();
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
    this.logger.check("selected", this.selected);
  }

  private setupHeads() {
    this.logger.check(
      "check cell 1",
      this.dependencies.StorageManager.storages.sheets[0].content.head[0][0]
        .content
    );
    this.logger.check(
      "check cell 2",
      this.dependencies.StorageManager.storages.sheets[1].content.head[0][0]
        .content
    );

    for (let y = 0; y < this.head.length; y++) {
      for (let x = 0; x < this.head[y].length; x++) {
        this.logger.debug(x, y, "render");
        const th = this.head[y][x].render();
        th.dataset.posX = "" + x;
        th.dataset.posY = "" + y;
        this.thead.append(th);
      }
    }
  }

  private setupBodies() {
    for (let y = 0; y < this.body.length; y++) {
      for (let x = 0; x < this.body[y].length; x++) {
        this.logger.debug(x, y, "render");
        const td = this.body[y][x].render();
        td.dataset.posX = "" + x;
        td.dataset.posY = "" + (this.head.length + y);
        this.tbody.append(td);
      }
    }
  }

  highlightSelectedCells() {
    const first = this.selected.at(0);
    const last = this.selected.at(-1);

    if (first && last) {
      this.logger.check("selected", this.selected);
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
              cell.selected = true;
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
    this.logger.process("save table", this.selected);
    this.sortingPosition();
    this.dependencies.StorageManager.saveStorage();
  }

  loadTable() {
    this.head = [];
    this.body = [];
    const storageManager = this.dependencies.StorageManager;
    // storageManager.loadStorage();
    const sheet = storageManager.findSheet(storageManager.sheetNumber);
    if (sheet) {
      console.log("storageManager.sheetNumber", sheet);
      this.head = sheet.content.head;
      this.body = sheet.content.body;
    }

    this.sortingPosition();
  }

  uploadSelected() {
    this.selected = [];
    this.logger.process("uploadSelected", this.selected);
    ([] as Cell[]).concat(...this.head, ...this.body).forEach((cell) => {
      console.log("여긴가??", cell.selected);
      if (cell.selected) {
        console.log("uploadSelected cell", cell);
        this.selected.push(cell);
      }
    });
    this.logger.process("🛠️ uploadSelected", this.selected);
  }

  initialize() {
    this.logger.process("initialize table manager");
    this.setupTable();
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
        cell.x = x;
        cell.y = y;
        cell.posX = x;
        cell.posY = y;
      });
    });
    this.body.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.x = x;
        cell.y = y;
        cell.posX = x;
        cell.posY = this.head.length + y;
      });
    });
  }

  addColumn(index: number) {
    this.head.forEach((head, y) => {
      head.splice(index, 0, new Cell(head.length, y, "th", "add"));
    });
    this.body.forEach((body, y) => {
      body.splice(index, 0, new Cell(body.length, y, "td", "add"));
    });
    this.sortingPosition();
  }

  addBeforeColumn() {
    this.head.forEach((head, y) => {
      head.unshift(new Cell(head.length, y, "th", "before"));
    });
    this.body.forEach((body, y) => {
      body.unshift(new Cell(body.length, y, "td", "before"));
    });
    this.sortingPosition();
  }

  addAfterColumn() {
    this.head.forEach((head, y) => {
      head.push(new Cell(head.length, y, "th", "after"));
    });
    this.body.forEach((body, y) => {
      body.push(new Cell(body.length, y, "td", "after"));
    });
    this.sortingPosition();
  }
}
