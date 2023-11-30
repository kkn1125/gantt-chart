import Sheet from "@/model/sheet";
import BaseModule from "./base.module";
import { APP } from "@/util/global";
import MenuManager from "./menu.manager";
import DropdownMenuItem from "@/model/dropdown.menu.item";

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

  fileNewSheet(self: DropdownMenuItem) {
    console.log("create new sheet");
    this.dependencies.ToolManager.createNewSheet();
    this.dependencies.Ui.render();
  }

  fileLocalSave(self: DropdownMenuItem) {
    console.log("save");
    this.dependencies.TableManager.saveTable();
  }

  fileSaveAs(self: DropdownMenuItem) {
    console.log("save as new filename");
  }

  fileClose(self: DropdownMenuItem) {
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

  toolAddColumnBefore(self: DropdownMenuItem) {
    console.log("add before column");
    this.dependencies.TableManager.addBeforeColumn();
    this.dependencies.Ui.render();
  }

  toolAddColumnAfter(self: DropdownMenuItem) {
    console.log("add before column");
    this.dependencies.TableManager.addAfterColumn();
    this.dependencies.Ui.render();
  }

  toolAddRowHeadTop(self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowHeadTop();
    this.dependencies.Ui.render();
  }

  toolAddRowHeadBottom(self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowHeadBottom();
    this.dependencies.Ui.render();
  }

  toolAddRowBodyTop(self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowBodyTop();
    this.dependencies.Ui.render();
  }

  toolAddRowBodyBottom(self: DropdownMenuItem) {
    console.log("add after column");
    this.dependencies.TableManager.addRowBodyBottom();
    this.dependencies.Ui.render();
  }

  toolTableFix(self: DropdownMenuItem) {
    console.log("table size fix");
  }

  aboutHelper(self: DropdownMenuItem) {
    console.log("도움말 열기");
  }

  sheetToolRemove(sheetId: number) {
    this.dependencies.StorageManager.deleteSheet(sheetId);
  }
}
