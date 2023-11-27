import Sheet from "@/model/sheet";
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

  constructor() {
    super();
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

  setCurrentSheetNumber(id: number) {
    this.sheetNumber = id;
  }

  initialize() {
    this.logger.process("initialize storage");
    if (this.isEmpty()) {
      this.addSheet(new Sheet());
      this.saveStorage();
      this.logger.process("setup empty storage as object");
    }

    this.loadStorage();

    Sheet.id = this.getBigId();

    if (this.storages.sheets.length === 0) {
      this.addSheet(new Sheet());
    }
    this.logger.process("✨ loaded storage");
  }

  isEmpty() {
    const item = localStorage.getItem(this.STORAGE);
    return item === "" || item === undefined || item === null;
  }

  getStorage() {
    this.logger.debug("get storage");
    return JSON.parse(localStorage.getItem(this.STORAGE) || "{}");
  }

  saveStorage(sheets: Sheet[] = this.storages.sheets) {
    this.logger.debug("save storage");
    localStorage.setItem(this.STORAGE, JSON.stringify(this.storages));
    this.storages.sheets = sheets;
    this.dependencies.Ui.render();
  }

  loadStorage() {
    this.logger.debug("load storage");
    this.storages = this.getStorage();
    this.storages.sheets = this.storages.sheets.map(
      (sheet) => new Sheet(sheet as Sheet)
    );
    return this.storages;
  }

  addSheet(data: Sheet) {
    console.log(data)
    this.storages.sheets.push(new Sheet(data));
    this.saveStorage();
  }

  findSheet(id: number) {
    this.logger.debug("find sheet", id);
    return this.storages.sheets.find((sheet) => sheet.id === id);
  }

  findSheetIndex(id: number) {
    this.logger.debug("find index sheet", id);
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
