import Sheet from "@/model/sheet";
import Logger from "./logger";
import BaseModule from "./base.module";

export default class StorageManager extends BaseModule {
  private readonly STORAGE = "gantt-store";

  sheetNumber: number = 0;

  storages: {
    sheets: Sheet[];
    options: {};
  } = {
    sheets: [],
    options: {},
  };

  logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(this.constructor.name);
    this.logger.debug("create storage manager");
  }

  getBigId() {
    return (
      this.storages.sheets.reduce((acc, cur) => {
        if (acc < cur.id) {
          acc = cur.id;
        }
        return acc;
      }, 0) || 0
    );
  }

  initialize() {
    this.logger.debug("initialize storage");
    if (this.isEmpty()) {
      this.addSheet(new Sheet());
      this.saveStorage();
      this.logger.debug("setup empty storage as object");
    }

    this.loadStorage();

    Sheet.id = this.getBigId();

    if (this.storages.sheets.length === 0) {
      this.addSheet(new Sheet());
    }
    this.logger.debug("load storage");
  }

  isEmpty() {
    const item = localStorage.getItem(this.STORAGE);
    return item === "" || item === undefined || item === null;
  }

  getStorage() {
    return JSON.parse(localStorage.getItem(this.STORAGE) || "{}");
  }

  saveStorage() {
    localStorage.setItem(this.STORAGE, JSON.stringify(this.storages));
    this.dependencies.Ui.render();
  }

  loadStorage() {
    this.storages = this.getStorage();
    return this.storages;
  }

  addSheet(data: Sheet) {
    this.storages.sheets.push(data);
    this.saveStorage();
  }

  findSheet(id: number) {
    return this.storages.sheets.find((sheet) => sheet.id === id);
  }

  findSheetIndex(id: number) {
    return this.storages.sheets.findIndex((sheet) => sheet.id === id);
  }

  deleteSheet(id: number) {
    const index = this.findSheetIndex(id);
    return this.storages.sheets.splice(index, 1);
  }

  update(sheet: Sheet) {
    const index = this.findSheetIndex(sheet.id);
    this.storages.sheets.splice(index, 1, sheet);
  }

  renameSheet(id: number, newName: string) {
    this.findSheet(id)?.rename(newName);
  }
}
