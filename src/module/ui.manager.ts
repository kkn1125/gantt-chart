import DropdownMenuItem from "@/model/dropdown.menu.item";
import BaseModule from "./base.module";
import Logger from "./logger";
import MenuManager from "./menu.manager";
import { MAIN } from "@/util/globa";

export default class Ui extends BaseModule {
  logger: Logger;

  dropdowns!: MenuManager;

  openedTool: string = "";
  dropdownHovered: boolean = false;
  dropdownOpened: boolean = false;

  private readonly HEADER = document.querySelector("#header") as HTMLDivElement;
  private readonly MENU = document.querySelector("#menu") as HTMLDivElement;

  constructor() {
    super();
    this.logger = new Logger(this.constructor.name);
    this.logger.debug("intialize ui");
  }

  createEl(element: string) {
    return document.createElement(element);
  }

  isChangedBeforeTool(toolName: string) {
    return this.openedTool !== toolName;
  }

  isDropdownOpened() {
    return !!document.querySelector("#menu-list");
  }

  eventCommit(dataset: DOMStringMap) {
    if (dataset) {
      this.dropdowns[dataset.toolItem as DropdownMenuNames].forEach(
        (dropdown) => {
          if (dropdown.name === dataset.toolItemName) {
            dropdown.feature();
          }
        }
      );
    }
  }

  dropdownClose() {
    document.querySelectorAll("#menu-list").forEach((el) => el.remove());
    this.dropdownOpened = false;
  }

  dropdownOpen(
    e: MouseEvent,
    toolName: DropdownMenuNames,
    subToolName?: string
  ) {
    if (!this.dropdownHovered || !toolName) return;
    // const target = e.target as HTMLDivElement;
    // const tool = target.dataset.tool;
    const el = document.querySelector(
      `[data-tool="${toolName}"]`
    ) as HTMLDivElement;
    const menuList = this.createEl("div");
    menuList.id = "menu-list";
    menuList.innerHTML = `${this.dropdowns[toolName]
      .map(
        (dropdown) =>
          `<div class="menu-item" data-tool-item="${dropdown.group}" data-tool-item-name="${dropdown.name}">${dropdown.name}</div>`
      )
      .join("")}`;
    const rect = el.getBoundingClientRect();
    menuList.style.top = rect.bottom + "px";
    menuList.style.left = rect.left + "px";
    document.body.insertAdjacentElement("beforeend", menuList);
    this.dropdownOpened = true;
    this.openedTool = toolName;
  }

  drawGnb() {
    this.MENU.innerHTML = `
      <div class="tab small fw-bold capitalize" data-tool="file">file</div>
      <div class="tab small fw-bold capitalize" data-tool="tool">tool</div>
      <div class="tab small fw-bold capitalize" data-tool="about">about</div>`;
  }

  setupDropdownMenus() {
    this.dropdowns = this.dependencies.MenuManager;
  }

  drawSheets() {
    MAIN.querySelector("#wrap-sheets")?.remove();
    MAIN.querySelector("#wrap-sheets-files")?.remove();

    const sheets = this.createEl("div");
    const sheetFiles = this.createEl("div");

    sheets.id = "wrap-sheets";
    sheetFiles.id = "wrap-sheets-files";

    sheetFiles.innerHTML = this.dependencies.StorageManager.storages.sheets
      .map(
        (sheet) =>
          `<div class="sheet" data-sheet-id="${sheet.id}" data-sheet-name="${sheet.name}">${sheet.id}. ${sheet.name}</div>`
      )
      .join("");

    MAIN.append(sheets, sheetFiles);
  }

  setupUi() {
    this.drawGnb();
    this.setupDropdownMenus();
    this.drawSheets();
  }

  render() {
    this.drawSheets();
  }
}
