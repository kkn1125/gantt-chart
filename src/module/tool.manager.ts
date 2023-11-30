import DropdownMenuItem from "@/model/dropdown.menu.item";
import Sheet from "@/model/sheet";
import BaseModule from "./base.module";

export default class ToolManager extends BaseModule {
  constructor() {
    super();
  }

  createNewSheet() {
    this.dependencies.StorageManager.addSheet(new Sheet());
  }

  save() {
    this.logger.debug("save");
    this.dependencies.TableManager.saveTable();
    // this.dependencies.StorageManager.saveStorage();
  }

  async requestFullScreen() {
    try {
      await document.body.requestFullscreen();
    } catch (err: any) {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
      );
    }
  }

  async exitFullScreen() {
    await document.exitFullscreen();
  }

  fileNewSheet(_self: DropdownMenuItem) {
    console.log("create new sheet");
    this.dependencies.ToolManager.createNewSheet();
    this.dependencies.Ui.render();
  }

  fileLocalSave(_self: DropdownMenuItem) {
    console.log("save");
    this.dependencies.TableManager.saveTable();
  }

  fileSaveAs(_self: DropdownMenuItem) {
    console.log("save as new filename");
  }

  fileClose(_self: DropdownMenuItem) {
    console.log("close gantt chart");
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
    console.log("add before column");
    this.dependencies.TableManager.addBeforeColumn();
    this.dependencies.Ui.render();
  }

  toolAddColumnAfter(_self: DropdownMenuItem) {
    console.log("add before column");
    this.dependencies.TableManager.addAfterColumn();
    this.dependencies.Ui.render();
  }

  toolAddRowHeadTop(_self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowHeadTop();
    this.dependencies.Ui.render();
  }

  toolAddRowHeadBottom(_self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowHeadBottom();
    this.dependencies.Ui.render();
  }

  toolAddRowBodyTop(_self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowBodyTop();
    this.dependencies.Ui.render();
  }

  toolAddRowBodyBottom(_self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowBodyBottom();
    this.dependencies.Ui.render();
  }

  toolTableFix(_self: DropdownMenuItem) {
    console.log("table size fix");
  }

  aboutHelper(_self: DropdownMenuItem) {
    console.log("도움말 열기");
  }

  sheetToolRemove(sheetId: number) {
    this.dependencies.StorageManager.deleteSheet(sheetId);
  }
}
