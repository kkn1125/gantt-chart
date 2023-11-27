import DropdownMenuItem from "@/model/dropdown.menu.item";
import BaseModule from "./base.module";

export default class MenuManager extends BaseModule {
  static Item = DropdownMenuItem;

  constructor() {
    super();
  }

  file: DropdownMenuItem[] = [];
  tool: DropdownMenuItem[] = [];
  about: DropdownMenuItem[] = [];

  initialize() {
    this.addMenu(
      "file",
      new MenuManager.Item("file", "New Sheet", () => {
        console.log("create new sheet");
        this.dependencies.ToolManager.createNewSheet();
      })
    );
    this.addMenu(
      "file",
      new MenuManager.Item("file", "Save", () => {
        console.log("save");
      })
    );
    this.addMenu(
      "file",
      new MenuManager.Item("file", "Save as ...", () => {
        console.log("save as new filename");
      })
    );
    this.addMenu(
      "file",
      new MenuManager.Item("file", "Close", () => {
        console.log("close gantt chart");
      })
    );

    this.addMenu(
      "tool",
      new MenuManager.Item("tool", "Full Screen", (self: DropdownMenuItem) => {
        if (self.name === "Full Screen") {
          this.dependencies.ToolManager.requestFullScreen();
          self.setName("Exit Screen");
        } else {
          this.dependencies.ToolManager.exitFullScreen();
          self.setName("Full Screen");
        }
      })
    );
    this.addMenu(
      "tool",
      new MenuManager.Item("tool", "add:head column", () => {
        console.log("add head column");
      })
    );
    this.addMenu(
      "tool",
      new MenuManager.Item("tool", "add:body column", () => {
        console.log("add body column");
      })
    );
    this.addMenu(
      "tool",
      new MenuManager.Item("tool", "table:fix", () => {
        console.log("table size fix");
      })
    );

    this.addMenu(
      "about",
      new MenuManager.Item("about", "도움말", () => {
        console.log("도움말 열기");
      })
    );
  }

  addMenu(menu: DropdownMenuNames, menuItem: DropdownMenuItem) {
    this[menu].push(menuItem);
  }
}
