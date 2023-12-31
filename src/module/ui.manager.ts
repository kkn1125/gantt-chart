import { BOARD, PANEL, SHEET_FILES } from "@/util/global";
import BaseModule from "./base.module";
import MenuManager from "./menu.manager";

interface CustomElement extends HTMLDivElement {
  custom: {
    x: number;
    y: number;
  };
}

export default class Ui extends BaseModule {
  dropdowns!: MenuManager;
  currentSheet: number = 0;
  openedTool: string = "";
  dropdownHovered: boolean = false;
  dropdownOpened: boolean = false;
  dragUiActivate: boolean = false;
  dragAreaUi: CustomElement = this.createEl("div") as CustomElement;

  constructor() {
    super();
    this.dragAreaUi.setAttribute("un-touchable", "");
    BOARD.append(this.dragAreaUi);
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

  dropdownOpen(toolName: DropdownMenuNames) {
    if (!this.dropdownHovered || !toolName) return;
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

  setupDropdownMenus() {
    this.dropdowns = this.dependencies.MenuManager;
  }

  drawSheets() {
    const storageManager = this.dependencies.StorageManager;
    SHEET_FILES.innerHTML = storageManager.storages.sheets
      .map(
        (sheet) =>
          `<div class="sheet" data-sheet-id="${sheet.id}" data-sheet-name="${
            sheet.name
          }"${sheet.id === storageManager.sheetNumber ? "current-sheet" : ""}>${
            sheet.id
          }. ${sheet.name}</div>`
      )
      .join("");
  }

  initialize() {
    this.setupDropdownMenus();
    this.logger.log(this);
    this.logger.log(this.dependencies.MenuManager);
    this.logger.log(this.dropdowns);
    this.dropdowns.render();
    this.render();
  }

  startDrawDragRect(e: MouseEvent) {
    const startPointX = e.clientX;
    const startPointY = e.clientY;

    this.dragUiActivate = true;
    this.dragAreaUi["custom"] = {
      x: startPointX,
      y: startPointY,
    };
    this.dragAreaUi.style.position = "fixed";
    this.dragAreaUi.style.top = startPointY + "px";
    this.dragAreaUi.style.left = startPointX + "px";
    this.dragAreaUi.style.transformOrigin = "top left";

    this.logger.debug(`Start DragRect: ${startPointX} ${startPointY}`);
  }

  movingDrawDragRect(e: MouseEvent) {
    if (!this.dragUiActivate) return;

    const leftColor = "#b8e24f";
    const rightColor = "#598de8";
    const leftBorder = (type = "solid") => `1px ${type} ${leftColor}`;
    const rightBorder = (type = "solid") => `1px ${type} ${rightColor}`;
    const movePointX = e.clientX - this.dragAreaUi.custom.x;
    const movePointY = e.clientY - this.dragAreaUi.custom.y;
    let valueX = movePointX;
    let valueY = movePointY;

    if (movePointX < 0 && movePointY >= 0) {
      this.dragAreaUi.style.transform = "scale(-1, 1)";
      this.dragAreaUi.style.backgroundColor = leftColor + 56;
      this.dragAreaUi.style.border = leftBorder();
      this.dragAreaUi.style.backgroundImage = "";
      valueX *= -1;
      valueY *= 1;
    } else if (movePointX >= 0 && movePointY >= 0) {
      this.dragAreaUi.style.transform = "scale(1, 1)";
      this.dragAreaUi.style.backgroundColor = rightColor + 56;
      this.dragAreaUi.style.border = rightBorder();
      this.dragAreaUi.style.backgroundImage = "";
      valueX *= 1;
      valueY *= 1;
    } else if (movePointX >= 0 && movePointY < 0) {
      this.dragAreaUi.style.transform = "scale(1, -1)";
      this.dragAreaUi.style.backgroundColor = rightColor + 56;
      this.dragAreaUi.style.border = "";
      this.dragAreaUi.style.backgroundImage = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23598DE8FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`;
      valueX *= 1;
      valueY *= -1;
    } else if (movePointX < 0 && movePointY < 0) {
      this.dragAreaUi.style.transform = "scale(-1, -1)";
      this.dragAreaUi.style.backgroundColor = leftColor + 56;
      this.dragAreaUi.style.border = "";
      this.dragAreaUi.style.backgroundImage = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23B8E24FFF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`;
      valueX *= -1;
      valueY *= -1;
    }

    this.dragAreaUi.style.width = valueX + "px";
    this.dragAreaUi.style.height = valueY + "px";
  }

  endDrawDragRect(e: MouseEvent) {
    this.dragAreaUi.style.position = "";
    this.dragAreaUi.style.top = "";
    this.dragAreaUi.style.left = "";
    this.dragAreaUi.style.backgroundColor = "";
    this.dragAreaUi.style.width = "";
    this.dragAreaUi.style.height = "";
    this.dragAreaUi.style.transformOrigin = "";
    this.dragAreaUi.style.transform = "";
    this.dragAreaUi.style.border = "";
    this.dragAreaUi.style.backgroundImage = "";

    this.dragUiActivate = false;
    const endPointX = e.clientX;
    const endPointY = e.clientY;
    this.logger.debug(`End DragRect: ${endPointX} ${endPointY}`);
  }

  openPanel(width: number | string) {
    PANEL.classList.add("open");
    const isStringDigit = typeof width === "string" && width.match(/^\d+$/);
    const isNumber = !isNaN(+width);
    if (isStringDigit || isNumber) {
      PANEL.style.width = width + "px";
    } else {
      PANEL.style.width = width as string;
    }
  }

  closePanel() {
    PANEL.classList.remove("open");
    PANEL.style.width = "";
  }

  openSheetTool(target: HTMLDivElement) {
    const sheetTool = this.createEl("div");
    sheetTool.id = "sheet-tool";
    sheetTool.dataset.sheetId = "" + target.dataset.sheetId;
    sheetTool.innerHTML = `
      <div class="sheet-menu-list">
        <div class="sheet-menu" data-sheet-id="${target.dataset.sheetId}" data-sheet-feat="rename">rename</div>
        <div class="sheet-menu" data-sheet-id="${target.dataset.sheetId}" data-sheet-feat="remove">remove</div>
        <div class="sheet-menu" data-sheet-id="${target.dataset.sheetId}" data-sheet-feat="move-left">move left</div>
        <div class="sheet-menu" data-sheet-id="${target.dataset.sheetId}" data-sheet-feat="move-right">move right</div>
      </div>
    `;
    const { left } = target.getBoundingClientRect();
    sheetTool.style.bottom =
      innerHeight - BOARD.clientHeight - 44 + 38.67 + "px";
    sheetTool.style.left = left + "px";
    BOARD.append(sheetTool);
  }

  closeSheetTool() {
    document.querySelectorAll("#sheet-tool").forEach((el) => {
      el.remove();
    });
  }

  runSheetTool(feature: string, sheetId: number) {
    if (feature === "remove") {
      this.dependencies.ToolManager.sheetToolRemove(sheetId);
    }
  }

  render() {
    this.dependencies.TableManager.update();
    this.drawSheets();
  }
}
