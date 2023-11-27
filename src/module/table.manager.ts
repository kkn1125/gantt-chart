import Cell from "@/model/cell";
import BaseModule from "@/module/base.module";
import { WRAP_SHEETS } from "@/util/globa";

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

    this.loadData();
    this.setupHeads();
    this.setupBodies();
  }

  private setupHeads() {
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

  private render() {
    this.logger.process("render table manager");
    this.setupTable();
  }

  highlightSelectedCells() {
    const first = this.selected.at(0);
    const last = this.selected.at(-1);
    if (first && last) {
      if (first === last) {
        first.selected = true;
      } else {
        const startX = first.x;
        const startY = first.y;
        const endX = last.x;
        const endY = last.y;
        ([] as Cell[])
          .concat(...this.head)
          .concat(...this.body)
          .forEach((cell) => {
            cell;
            cell.selected = true;
          });
      }
    }
  }

  saveData() {
    const storageManager = this.dependencies.StorageManager;
    const sheet = storageManager.findSheet(storageManager.sheetNumber);

    this.sortingPosition();

    if (sheet) {
      this.head = this.head.map((row) => row.map((cell) => new Cell(cell)));
      this.body = this.body.map((row) => row.map((cell) => new Cell(cell)));
      sheet.save(this.head, this.body);
    }
  }

  loadData() {
    const storageManager = this.dependencies.StorageManager;
    storageManager.loadStorage();
    const sheet = storageManager.findSheet(storageManager.sheetNumber);
    if (sheet) {
      this.logger.log(sheet.content.head);
      this.logger.log(this.head);
      this.head = sheet.content.head;
      this.body = sheet.content.body;
    }
    this.sortingPosition();
  }

  initialize() {
    this.logger.process("initialize table manager");
    this.setupTable();
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

  findCellByPos(x: number, y: number, type: string) {
    if (type === "th") {
      return this.head.flat(1).find((cell) => cell.x === x && cell.y === y);
    } else if (type === "td") {
      return this.body.flat(1).find((cell) => cell.x === x && cell.y === y);
    } else {
      return undefined;
    }
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
    this.dependencies.Ui.render();
  }

  addBeforeColumn() {
    this.head.forEach((head, y) => {
      head.unshift(new Cell(head.length, y, "th", "before"));
    });
    this.body.forEach((body, y) => {
      body.unshift(new Cell(body.length, y, "td", "before"));
    });
    this.sortingPosition();
    this.dependencies.Ui.render();
  }

  addAfterColumn() {
    this.head.forEach((head, y) => {
      head.push(new Cell(head.length, y, "th", "after"));
    });
    this.body.forEach((body, y) => {
      body.push(new Cell(body.length, y, "td", "after"));
    });

    this.dependencies.Ui.render();
  }

  renderer() {
    return {
      render: this.render.bind(this),
    };
  }
}
