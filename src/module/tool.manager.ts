import DropdownMenuItem from "@/model/dropdown.menu.item";
import Sheet from "@/model/sheet";
import BaseModule from "./base.module";
import Cell from "@/model/cell";
import { findEmptyNumbers } from "@/util/findEmptyNumbers";
import { getNumberBySheetName } from "@/util/getNumberBySheetName";

export default class ToolManager extends BaseModule {
  constructor() {
    super();
  }

  createNewSheet() {
    const sheetNames = this.dependencies.StorageManager.storages.sheets
      .reduce<string[]>((acc, cur) => {
        if (cur.name.match(/^sheet/) && !acc.includes(cur.name)) {
          acc.push(cur.name);
        }
        return acc;
      }, [])
      .toSorted((a, b) => (a > b ? 1 : -1));

    const emptyNumbers = findEmptyNumbers(sheetNames);
    const nextNumber =
      emptyNumbers.shift() ||
      getNumberBySheetName(sheetNames[sheetNames.length - 1]) + 1;
    const nextSheetName = `sheet${nextNumber.toString().padStart(2, "0")}`;

    this.dependencies.StorageManager.addSheet(
      new Sheet({
        id: ++Sheet.id,
        name: nextSheetName,
        content: {
          head: [[new Cell(0, 0, "th", "test")]],
          body: [[new Cell(0, 0, "td", "test")]],
        },
      })
    );
  }

  save() {
    this.logger.debug("save");
    this.dependencies.TableManager.saveTable();
    // this.dependencies.StorageManager.saveStorage();
  }

  async requestFullScreen() {
    try {
      await document.body.requestFullscreen({
        navigationUI: "auto",
      });
    } catch (err: any) {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
      );
    }
  }

  async exitFullScreen() {
    try {
      await document.exitFullscreen();
    } catch (error: any) {
      // this.logger.log(error.message, error.code);
    }
  }

  fileNewSheet(_self: DropdownMenuItem) {
    this.logger.log("create new sheet");
    this.dependencies.ToolManager.createNewSheet();
    this.dependencies.Ui.render();
  }

  fileLocalSave(_self: DropdownMenuItem) {
    this.logger.log("save");
    this.dependencies.TableManager.saveTable();
  }

  fileSaveAsHTML(_self: DropdownMenuItem) {
    this.logger.log("save as new filename");
    this.dependencies.TableManager.exportHTML();
  }

  fileSaveAsBackup(_self: DropdownMenuItem) {
    this.logger.log("save as backup");
  }

  fileClose(_self: DropdownMenuItem) {
    this.logger.log("close gantt chart");
  }

  toolFullScreen(self: DropdownMenuItem) {
    if (self.name === "Full Screen") {
      this.dependencies.ToolManager.requestFullScreen();
      self.setName("Exit Screen");
    } else {
      this.dependencies.ToolManager.exitFullScreen();
      self.setName("Full Screen");
    }
  }

  toolAddColumnBefore(_self: DropdownMenuItem) {
    this.logger.log("add before column");
    this.dependencies.TableManager.addBeforeColumn();
    // this.dependencies.Ui.render();
  }

  toolAddColumnAfter(_self: DropdownMenuItem) {
    this.logger.log("add before column");
    this.dependencies.TableManager.addAfterColumn();
    // this.dependencies.Ui.render();
  }

  toolAddRowHeadTop(_self: DropdownMenuItem) {
    this.logger.log("add after column");
    this.dependencies.TableManager.addRowHeadTop();
    // this.dependencies.Ui.render();
  }

  toolAddRowHeadBottom(_self: DropdownMenuItem) {
    this.logger.log("add after column");
    this.dependencies.TableManager.addRowHeadBottom();
    // this.dependencies.Ui.render();
  }

  toolAddRowBodyTop(_self: DropdownMenuItem) {
    this.logger.log("add after column");
    this.dependencies.TableManager.addRowBodyTop();
    // this.dependencies.Ui.render();
  }

  toolAddRowBodyBottom(_self: DropdownMenuItem) {
    this.logger.log("add after column");
    this.dependencies.TableManager.addRowBodyBottom();
    // this.dependencies.Ui.render();
  }

  toolTableFixed(self: DropdownMenuItem) {
    if (self.name === "Table:fixed") {
      this.dependencies.TableManager.tableLayoutFixed();
      this.logger.log("table size fixed");
      self.setName("Table:auto");
      // this.dependencies.Ui.render();
    } else {
      this.dependencies.TableManager.tableLayoutAuto();
      self.setName("Table:fixed");
      // this.dependencies.Ui.render();
    }
  }

  aboutHelper(_self: DropdownMenuItem) {
    this.logger.log("도움말 열기");
    this.dependencies.Ui.popupAbout();
  }

  sheetToolRemove(sheetId: number) {
    this.dependencies.StorageManager.deleteSheet(sheetId);
  }

  sheetToolRename(sheetId: number, rename: string) {
    this.dependencies.StorageManager.renameSheet(sheetId, rename);
  }

  sheetToolMoveLeft(sheetId: number) {
    this.dependencies.StorageManager.moveSheet(sheetId, -1);
  }

  sheetToolMoveRight(sheetId: number) {
    this.dependencies.StorageManager.moveSheet(sheetId, 1);
  }
}
