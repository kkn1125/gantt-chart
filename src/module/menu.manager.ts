import DropdownMenuItem from "@/model/dropdown.menu.item";
import BaseModule from "./base.module";
import { MENU } from "@/util/global";

export default class MenuManager extends BaseModule {
  static Item = DropdownMenuItem;

  constructor() {
    super();
  }

  menulist: DropdownMenuItem[] = [];

  initialize() {
    const fileTab = new DropdownMenuItem("file", "파일");
    const fileNewSheet = new DropdownMenuItem(
      "file",
      "New Sheet",
      this.dependencies.ToolManager.fileNewSheet.bind(this)
    );
    const fileLocalSave = new DropdownMenuItem(
      "file",
      "Local Save",
      this.dependencies.ToolManager.fileLocalSave.bind(this)
    );
    const fileSaveAs = new DropdownMenuItem(
      "file",
      "Save as ...",
      this.dependencies.ToolManager.fileSaveAs.bind(this)
    );
    const fileClose = new DropdownMenuItem(
      "file",
      "Close",
      this.dependencies.ToolManager.fileClose.bind(this)
    );

    fileTab.addMenuItem(fileNewSheet);
    fileTab.addMenuItem(fileLocalSave);
    fileTab.addMenuItem(fileSaveAs);
    fileTab.addMenuItem(fileClose);

    const toolTab = new DropdownMenuItem("tool", "도구");
    const toolFullScreen = new DropdownMenuItem(
      "screen",
      "Full Screen",
      this.dependencies.ToolManager.toolFullScreen.bind(this)
    );
    const toolAddCell = new DropdownMenuItem("add tool", "add rows, columns");
    const toolAddColumnBefore = new DropdownMenuItem(
      "tool",
      "Add column: Before",
      this.dependencies.ToolManager.toolAddColumnBefore.bind(this)
    );
    const toolAddColumnAfter = new DropdownMenuItem(
      "tool",
      "Add column: After",
      this.dependencies.ToolManager.toolAddColumnAfter.bind(this)
    );
    const toolAddRowHeadTop = new DropdownMenuItem(
      "tool",
      "Add row: Head top",
      this.dependencies.ToolManager.toolAddRowHeadTop.bind(this)
    );
    const toolAddRowHeadBottom = new DropdownMenuItem(
      "tool",
      "Add row: Head bottom",
      this.dependencies.ToolManager.toolAddRowHeadBottom.bind(this)
    );
    const toolAddRowBodyTop = new DropdownMenuItem(
      "tool",
      "Add row: Body top",
      this.dependencies.ToolManager.toolAddRowBodyTop.bind(this)
    );
    const toolAddRowBodyBottom = new DropdownMenuItem(
      "tool",
      "Add row: Body bottom",
      this.dependencies.ToolManager.toolAddRowBodyBottom.bind(this)
    );
    const toolTableFix = new DropdownMenuItem(
      "tool",
      `Table:${
        this.dependencies.StorageManager.storages.options.tableLayout ===
        "fixed"
          ? "auto"
          : "fixed"
      }`,
      this.dependencies.ToolManager.toolTableFixed.bind(this)
    );
    toolAddCell.addMenuItem(toolAddColumnBefore);
    toolAddCell.addMenuItem(toolAddColumnAfter);
    toolAddCell.addMenuItem(toolAddRowHeadTop);
    toolAddCell.addMenuItem(toolAddRowHeadBottom);
    toolAddCell.addMenuItem(toolAddRowBodyTop);
    toolAddCell.addMenuItem(toolAddRowBodyBottom);

    toolTab.addMenuItem(toolFullScreen);
    toolTab.addMenuItem(toolTableFix);
    toolTab.addSubMenuItem(toolAddCell);

    const aboutTab = new DropdownMenuItem("about", "도움말");
    const aboutHelper = new DropdownMenuItem(
      "about",
      "도움말",
      this.dependencies.ToolManager.aboutHelper.bind(this)
    );
    aboutTab.addMenuItem(aboutHelper);

    this.addMenu(fileTab);
    this.addMenu(toolTab);
    this.addMenu(aboutTab);
  }

  addMenu(menuItem: DropdownMenuItem) {
    this.menulist.push(menuItem);
  }

  drawGnb() {
    MENU.innerHTML = this.menulist
      .map((menu) => {
        return `<div class="tab small fw-bold capitalize" data-tool="${menu.group}">${menu.name}</div>`;
      })
      .join("");
  }

  findTabByName(name: string) {
    for (const menu of this.menulist) {
      const result = menu.findTabByName(name);
      if (result) {
        return result;
      }
    }
    return;
  }

  render() {
    this.drawGnb();
  }

  findTab(tabName: string) {
    const menu = this.menulist.find((menu) => menu.findTab(tabName));
    if (menu) {
      return menu;
    }
    return;
  }

  open(tabName: string) {
    const menu = this.findTab(tabName);
    return menu;
  }

  close() {
    this.menulist.forEach((menu) => menu.close());
  }
}
