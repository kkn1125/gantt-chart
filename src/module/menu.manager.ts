import DropdownMenuItem from "@/model/dropdown.menu.item";
import BaseModule from "./base.module";
import { MENU } from "@/util/global";

export default class MenuManager extends BaseModule {
  static Item = DropdownMenuItem;

  constructor() {
    super();
  }

  file: DropdownMenuItem[] = [];
  tool: DropdownMenuItem[] = [];
  about: DropdownMenuItem[] = [];

  initialize() {
    const fileNewSheet = new MenuManager.Item(
      "file",
      "New Sheet",
      this.dependencies.ToolManager.fileNewSheet.bind(this)
    );
    const fileLocalSave = new MenuManager.Item(
      "file",
      "Local Save",
      this.dependencies.ToolManager.fileLocalSave.bind(this)
    );
    const fileSaveAs = new MenuManager.Item(
      "file",
      "Save as ...",
      this.dependencies.ToolManager.fileSaveAs.bind(this)
    );
    const fileClose = new MenuManager.Item(
      "file",
      "Close",
      this.dependencies.ToolManager.fileClose.bind(this)
    );

    const toolFullScreen = new MenuManager.Item(
      "tool",
      "Full Screen",
      this.dependencies.ToolManager.toolFullScreen.bind(this)
    );

    const toolAddColumnBefore = new MenuManager.Item(
      "tool",
      "add column: before",
      this.dependencies.ToolManager.toolAddColumnBefore.bind(this)
    );
    const toolAddColumnAfter = new MenuManager.Item(
      "tool",
      "add column: after",
      this.dependencies.ToolManager.toolAddColumnAfter.bind(this)
    );
    const toolAddRowHeadTop = new MenuManager.Item(
      "tool",
      "add row: head top",
      this.dependencies.ToolManager.toolAddRowHeadTop.bind(this)
    );
    const toolAddRowHeadBottom = new MenuManager.Item(
      "tool",
      "add row: head bottom",
      this.dependencies.ToolManager.toolAddRowHeadBottom.bind(this)
    );
    const toolAddRowBodyTop = new MenuManager.Item(
      "tool",
      "add row: body top",
      this.dependencies.ToolManager.toolAddRowBodyTop.bind(this)
    );
    const toolAddRowBodyBottom = new MenuManager.Item(
      "tool",
      "add row: body bottom",
      this.dependencies.ToolManager.toolAddRowBodyBottom.bind(this)
    );
    const toolTableFix = new MenuManager.Item(
      "tool",
      `table:${
        this.dependencies.StorageManager.storages.options.tableLayout ===
        "fixed"
          ? "auto"
          : "fixed"
      }`,
      this.dependencies.ToolManager.toolTableFixed.bind(this)
    );

    const aboutHelper = new MenuManager.Item(
      "about",
      "도움말",
      this.dependencies.ToolManager.aboutHelper.bind(this)
    );

    this.addMenu("file", fileNewSheet);
    this.addMenu("file", fileLocalSave);
    this.addMenu("file", fileSaveAs);
    this.addMenu("file", fileClose);

    this.addMenu("tool", toolFullScreen);
    this.addMenu("tool", toolAddColumnBefore);
    this.addMenu("tool", toolAddColumnAfter);
    this.addMenu("tool", toolAddRowHeadTop);
    this.addMenu("tool", toolAddRowHeadBottom);
    this.addMenu("tool", toolAddRowBodyTop);
    this.addMenu("tool", toolAddRowBodyBottom);
    this.addMenu("tool", toolTableFix);

    this.addMenu("about", aboutHelper);
  }

  addMenu(menu: DropdownMenuNames, menuItem: DropdownMenuItem) {
    this[menu].push(menuItem);
  }

  drawGnb() {
    MENU.innerHTML = `
      <div class="tab small fw-bold capitalize" data-tool="file">file</div>
      <div class="tab small fw-bold capitalize" data-tool="tool">tool</div>
      <div class="tab small fw-bold capitalize" data-tool="about">about</div>`;
  }

  render() {
    this.drawGnb();
  }
}
