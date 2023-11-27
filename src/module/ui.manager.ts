import { MAIN, SHEET_FILES } from "@/util/globa";
import BaseModule from "./base.module";
import MenuManager from "./menu.manager";

export default class Ui extends BaseModule {
  dropdowns!: MenuManager;
  currentSheet: number = 0;
  openedTool: string = "";
  dropdownHovered: boolean = false;
  dropdownOpened: boolean = false;

  private readonly HEADER = document.querySelector("#header") as HTMLDivElement;
  private readonly MENU = document.querySelector("#menu") as HTMLDivElement;

  constructor() {
    super();
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

  selectSheet(sheetId: number) {
    const storageManager = this.dependencies.StorageManager;
    // const tableManager = this.dependencies.TableManager;
    storageManager.setCurrentSheetNumber(sheetId);
    this.render();
  }

  drawSheets() {
    // console.log(SHEET_FILES)
    const storageManager = this.dependencies.StorageManager;
    SHEET_FILES.innerHTML = storageManager.storages.sheets
      .map(
        (sheet, index) =>
          `<div class="sheet" data-sheet-id="${sheet.id}" data-sheet-name="${
            sheet.name
          }"${sheet.id === storageManager.sheetNumber ? "current-sheet" : ""}>${
            sheet.id
          }. ${sheet.name}</div>`
      )
      .join("");

    // MAIN.append(sheets, SHEET_FILES);
  }

  setupUi() {
    this.drawGnb();
    this.setupDropdownMenus();
    this.render();
  }

  render() {
    this.dependencies.TableManager.renderer().render();
    this.drawSheets();
  }
}
