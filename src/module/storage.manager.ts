import Sheet from "@/model/sheet";
import BaseModule from "./base.module";

export default class StorageManager extends BaseModule {
  /* private */ readonly STORAGE = "gantt-store";

  sheetNumber: number = 0;

  storages: {
    sheets: Sheet[];
    options: Partial<CSSStyleDeclaration>;
  } = {
    sheets: [],
    options: {},
  };

  constructor() {
    super();
  }

  set addOption(options: Partial<CSSStyleDeclaration>) {
    Object.assign(this.storages.options, options);
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
    // this.logger.debug("test", id);
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

  initSheetNumber() {
    // 시트가 삭제 되고 번호 자체가 없을 때 초기화한다.
    if (this.storages.sheets.every((sheet) => sheet.id !== this.sheetNumber)) {
      this.sheetNumber = this.storages.sheets[0].id;
    }
  }

  saveStorage(sheets: Sheet[] = this.storages.sheets) {
    this.logger.debug("save storage", sheets);
    localStorage.setItem(this.STORAGE, JSON.stringify(this.storages));
  }

  loadStorage() {
    this.logger.debug("load storage", this.storages);
    this.storages = this.getStorage();
    this.storages.sheets = this.storages.sheets.map(
      (sheet) => new Sheet(sheet as Sheet)
    );

    this.initSheetNumber();

    return this.storages;
  }

  addSheet(data: Sheet) {
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
    const nextSheet =
      this.storages.sheets[index + 1] ?? this.storages.sheets[index - 1];
    const deletedSheet = this.storages.sheets.splice(index, 1);
    this.sheetNumber = nextSheet.id;
    // 삭제 후 다음 시트 번호로 교체 없으면, 이전 시트 번호로 교체
    return deletedSheet;
  }

  update(sheet: Sheet) {
    const index = this.findSheetIndex(sheet.id);
    this.storages.sheets.splice(index, 1, sheet);
  }

  renameSheet(id: number, newName: string) {
    this.findSheet(id)?.rename(newName);
  }
}
