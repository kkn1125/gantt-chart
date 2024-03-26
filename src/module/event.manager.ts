import BaseModule from "./base.module";
import PanelManager from "./panel.manager";

export default class EventManager extends BaseModule {
  // dbClick: { el?: HTMLElement; gap?: number } = {};
  editingEl: HTMLTableCellElement | null = null;

  constructor() {
    super();
    this.handleCellInput = this.handleCellInput.bind(this);
  }

  initialize() {
    window.addEventListener("keydown", this.handleKeydown.bind(this));
    // window.addEventListener("keyup", this.handleKeyup.bind(this));
    window.addEventListener("input", this.handleInput.bind(this));
    window.addEventListener("change", this.handleChange.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    window.addEventListener("mousedown", this.handleSelectStart.bind(this));
    window.addEventListener("mouseup", this.handleSelectEnd.bind(this));
    window.addEventListener("contextmenu", this.handleContextMenu.bind(this));
  }

  initializeSelectedInTableCells() {
    this.logger.process("🛠️ check", "initialize selected");

    this.dependencies.TableManager.initSelected();
    this.logger.process(
      "check selected",
      this.dependencies.TableManager.selected
    );
  }

  removeContentEditable() {
    this.logger.debug("cancel");
    document.querySelectorAll(`[contenteditable]`).forEach((cell) => {
      cell.removeAttribute("contenteditable");
    });
    this.editingEl = null;
  }

  removeContentEditableAndSave() {
    this.removeContentEditable();
    this.dependencies.TableManager.saveTable();
  }

  openPanel() {
    this.dependencies.PanelManager.openPanel();
  }

  closePanel() {
    this.dependencies.PanelManager.closePanel();
  }

  isOpenedPanel() {
    return this.dependencies.PanelManager.isOpened();
  }

  isOpenedSheetTool() {
    return this.dependencies.PanelManager.isOpenedSheetTool();
  }

  handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target && target.classList.contains("total")) {
      const hexColor = target.value;
      const palette = this.dependencies.PanelManager.parseHexToRGB(hexColor);
      this.dependencies.PanelManager.previewColor = palette;
      this.dependencies.PanelManager.previewUpdate();

      this.dependencies.TableManager.selected.forEach((cell) => {
        Object.assign(cell.style, {
          backgroundColor: this.dependencies.PanelManager.getBackgroundColor(),
        });
      });

      this.dependencies.TableManager.saveTable();
      this.dependencies.TableManager.update();
    }
  }

  handleContextMenu(e: MouseEvent) {
    if (e.button === 2) {
      // right click
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLTableCellElement;
      if (target && target.classList.contains("cell")) {
        if (!this.isOpenedPanel()) {
          this.updatePanel();
          this.openPanel();
        } else {
          this.updatePanel();
        }
      }

      if (target && target.classList.contains("sheet")) {
        this.dependencies.Ui.closeSheetTool();
        this.dependencies.Ui.openSheetTool(target as HTMLDivElement);
      }
    }
  }

  handleSelectStart(e: MouseEvent) {
    if (e.button !== 0) return;

    if (!e.shiftKey) {
      const target = e.target as HTMLTableCellElement;
      if (target && !target.closest("#panel")) {
        this.initializeSelectedInTableCells();
      }
    } else {
      // this.initializeSelectedInTableCells();
      // this.dependencies.TableManager.selected = [];
    }

    const target = e.target as HTMLTableCellElement;
    if (target && target.classList.contains("cell")) {
      const cell = this.dependencies.TableManager.findCellByPos(
        +(target.dataset.posX as string),
        +(target.dataset.posY as string)
      );
      if (cell) {
        this.logger.check("check cell");
        this.dependencies.TableManager.selectCell(cell);
        this.dependencies.Ui.startDrawDragRect(e);
      } else {
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    this.dependencies.Ui.movingDrawDragRect(e);

    if (
      !target.closest("#menu-list") &&
      !target.closest("#sub-list") &&
      this.dependencies.Ui.currentTab !== target.dataset.tool
    ) {
      this.dependencies.MenuManager.close();
      this.dependencies.Ui.closeTabMenu();
    }

    if (
      target.dataset.tool ||
      target.closest("#menu-list") ||
      target.closest("#sub-list")
    ) {
      if (target.dataset.tool) {
        this.dependencies.Ui.currentTab = target.dataset.tool;
      }
      this.dependencies.Ui.dropdownHovered = true;
    } else {
      this.dependencies.Ui.dropdownOpened = false;
    }

    if (
      !document.querySelector("#menu-list") &&
      this.dependencies.Ui.dropdownHovered &&
      this.dependencies.Ui.dropdownOpened
    ) {
      if (target.dataset.tool !== undefined) {
        const menu = this.dependencies.MenuManager.findTab(target.dataset.tool);
        if (menu) {
          const root = document.querySelector(
            `[data-tool="${menu.group}"]`
          ) as HTMLDivElement;
          this.dependencies.Ui.openTabMenu(menu, root);
        }
      }
    }
  }

  handleSelectEnd(e: MouseEvent) {
    if (e.button !== 0) return;

    const target = e.target as HTMLTableCellElement;
    if (target && target.classList.contains("cell")) {
      const cell = this.dependencies.TableManager.findCellByPos(
        +(target.dataset.posX as string),
        +(target.dataset.posY as string)
      );
      if (cell && this.dependencies.Ui.dragUiActivate) {
        if (this.dependencies.TableManager.hasSelected(cell)) {
          this.logger.check("selected had cell", cell);
        }
        this.dependencies.TableManager.selectCell(cell);
        this.dependencies.TableManager.highlightSelectedCells();
      }
    } else {
      if (target && !target.closest("#panel")) {
        this.initializeSelectedInTableCells();
      }
    }

    this.dependencies.Ui.endDrawDragRect(e);
  }

  updatePanel() {
    this.dependencies.PanelManager.initializeCellBackgroudColorSet();
    this.dependencies.PanelManager.previewUpdate();
    this.dependencies.PanelManager.initializeCellBorders();
    this.dependencies.PanelManager.initializeSizeOptions();
    this.dependencies.PanelManager.update();
  }

  handleClick(e: MouseEvent) {
    const target = e.target as HTMLDivElement;

    if (target.dataset.toolName) {
      const tab = this.dependencies.MenuManager.findTabByName(
        target.dataset.toolName
      );
      this.logger.log(tab, target.dataset.toolName);
      tab?.feature();
    }

    this.dependencies.MenuManager.close();
    this.dependencies.Ui.closeTabMenu();
    this.dependencies.Ui.dropdownOpened = false;

    if (target.classList.contains("exit")) {
      document.querySelectorAll(".about-command").forEach((el) => el?.remove());
    }

    if (target.dataset.tool !== undefined) {
      const menu = this.dependencies.MenuManager.findTab(target.dataset.tool);
      if (menu) {
        const root = document.querySelector(
          `[data-tool="${menu.group}"]`
        ) as HTMLDivElement;
        this.dependencies.Ui.openTabMenu(menu, root);
        this.dependencies.Ui.dropdownOpened = true;
      }
    }

    if (target && target.classList.contains("sheet")) {
      const id = +(target.dataset.sheetId || 0);
      this.dependencies.TableManager.swapSheet(id);
    }

    if (target && target.classList.contains("sheet-menu")) {
      // this.dependencies.ToolManager.addRowHeadTop();
      const id = +(target.dataset.sheetId as string);
      const feature = target.dataset.sheetFeat as string;
      this.dependencies.Ui.runSheetTool(feature, id);
      this.dependencies.Ui.closeSheetTool();
      this.dependencies.TableManager.saveTable();
      this.dependencies.StorageManager.loadStorage();
      this.dependencies.TableManager.update();
      this.dependencies.Ui.render();
    }

    if (target && target.classList.contains("cell")) {
      if (this.editingEl && this.editingEl !== target) {
        this.removeContentEditableAndSave();
      }
      if (this.isOpenedPanel()) {
        this.updatePanel();
      }
    } else {
      if (this.editingEl) {
        this.removeContentEditableAndSave();
        this.editingEl.removeEventListener("input", this.handleCellInput);
      }
    }

    if (target && !target.closest("#panel")) {
      if (
        this.isOpenedPanel() &&
        this.dependencies.TableManager.selected.length === 0
      ) {
        this.closePanel();
      }
    }

    if (target && target.closest("#panel")) {
      if ("dir" in target.dataset) {
        switch (target.dataset.dir) {
          case "all":
            this.dependencies.TableManager.concatAll();
            break;
          case "split":
            this.dependencies.TableManager.splitCell();
            break;
          default:
            // none
            break;
        }
      } else if ("cellAdd" in target.dataset) {
        switch (target.dataset.cellAdd) {
          case "left":
            this.dependencies.TableManager.addColumnLeftSide();
            break;
          case "right":
            this.dependencies.TableManager.addColumnRightSide();
            break;
          case "top":
            this.dependencies.TableManager.addRowTop();
            break;
          case "bottom":
            this.dependencies.TableManager.addRowBottom();
            break;
        }
      } else if ("cellRemove" in target.dataset) {
        switch (target.dataset.cellRemove) {
          case "row":
            this.dependencies.TableManager.removeRow();
            break;
          case "column":
            this.dependencies.TableManager.removeColumn();
            break;
        }
      } else if ("cellFeature" in target.dataset) {
        switch (target.dataset.cellFeature) {
          case "remove-style":
            this.dependencies.TableManager.removeStyle();
            break;
          case "remove-content":
            this.dependencies.TableManager.removeContent();
            break;
        }
      } else if ("borderCheck" in target.dataset) {
        switch (target.dataset.borderCheck) {
          case "top": {
            this.dependencies.TableManager.drawBorderTop();
            break;
          }
          case "bottom": {
            this.dependencies.TableManager.drawBorderBottom();
            break;
          }
          case "left": {
            this.dependencies.TableManager.drawBorderLeft();
            break;
          }
          case "right": {
            this.dependencies.TableManager.drawBorderRight();
            break;
          }
          case "all": {
            this.logger.log("all");
            this.dependencies.TableManager.drawBorderAll();
            break;
          }
        }
        this.updatePanel();
        this.dependencies.TableManager.saveTable();
        this.dependencies.TableManager.update();
      }
    }
  }

  handleDoubleClick(e: MouseEvent) {
    const target = e.target as HTMLTableCellElement;
    if (target.classList.contains("cell")) {
      this.editingEl = target;

      target.contentEditable = "true";
      target.focus();
      const selection = window.getSelection() as Selection;
      selection.selectAllChildren(target);

      this.editingEl.addEventListener("input", this.handleCellInput);
    }
  }

  handleCellInput(this: EventManager /* ev: Event */) {
    if (!this.editingEl) return;

    const id = +(this.editingEl.dataset.id as string);
    const type = this.editingEl.dataset.type as string;
    const cell = this.dependencies.TableManager.findCellById(id, type);
    if (cell) {
      cell.setContent(this.editingEl.innerText);
    }
  }

  handleKeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    // if (key === "a") {
    //   this.logger.log(this.dependencies.Ui);
    // }

    if (this.editingEl) {
      if (e.shiftKey && key === "enter") {
        this.editingEl.removeEventListener("input", this.handleCellInput);
        this.removeContentEditableAndSave();
      }
      if (key === "escape") {
        this.editingEl.removeEventListener("input", this.handleCellInput);
        this.removeContentEditable();
        this.dependencies.TableManager.initSelected();
        this.dependencies.TableManager.saveTable();
        this.dependencies.TableManager.update();
      }
    } else {
      if (e.ctrlKey) {
        if (key === "a") {
          this.dependencies.TableManager.selectAllCells();
          this.dependencies.TableManager.highlightSelectedCells();
        }

        /* return and stop feature, if not selected. */
        if (this.dependencies.TableManager.selected.length === 0) return;

        if (key === "c") {
          const copyContents = this.dependencies.TableManager.selected
            .map((cell) => cell.content)
            .filter((content) => content.trim())
            .join("\n");
          navigator.clipboard.writeText(copyContents).then(() => {
            this.logger.check("completed copied by cells contents.");
          });
        }
        if (key === "v") {
          navigator.clipboard.readText().then((value) => {
            this.dependencies.TableManager.selected.forEach((cell) => {
              cell.content = value;
            });
            this.logger.check("paste user's copied text: " + value);
            this.dependencies.TableManager.saveTable();
            this.dependencies.TableManager.update();
          });
        }
      }

      if (key === "escape") {
        /* 도움말 모달 닫기 */
        document
          .querySelectorAll(".about-command")
          .forEach((el) => el?.remove());

        if (this.isOpenedPanel()) {
          this.closePanel();
        }
        if (this.isOpenedSheetTool()) {
          this.dependencies.Ui.closeSheetTool();
        }
        if (this.isOpenedSheetRenameWindow()) {
          this.dependencies.Ui.closeSubmitRename();
        }
        this.dependencies.TableManager.initSelected();
        this.dependencies.TableManager.saveTable();
        this.dependencies.TableManager.update();
      }

      if (key === "backspace") {
        this.dependencies.TableManager.selected.forEach((cell) => {
          cell.content = "";
        });
        this.dependencies.TableManager.saveTable();
        this.dependencies.TableManager.update();
      }
    }
  }
  isOpenedSheetRenameWindow() {
    return !!window.renameForm;
  }

  // handleKeyup(e: KeyboardEvent) {
  //   const target = e.target as HTMLInputElement;
  //   if (target && target.classList.contains("rgba")) {
  //     const rgbaName = target.name as keyof PanelManager["previewColor"];
  //     this.dependencies.PanelManager.previewColor[rgbaName] = +target.value;
  //     this.dependencies.PanelManager.previewUpdate();
  //   }
  // }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target && target.classList.contains("rgba")) {
      const rgbaName = target.name as keyof PanelManager["previewColor"];
      this.dependencies.PanelManager.previewColor[rgbaName] = +target.value;
      this.dependencies.PanelManager.previewUpdate();

      this.dependencies.TableManager.selected.forEach((cell) => {
        Object.assign(cell.style, {
          backgroundColor: this.dependencies.PanelManager.getBackgroundColor(),
        });
      });

      this.dependencies.TableManager.saveTable();
      this.dependencies.TableManager.update();
    }
    if (target && target.name === "width") {
      this.dependencies.TableManager.selected
        .flatMap((cell) => {
          return this.dependencies.TableManager.getColumnBy(cell.x);
        })
        .forEach((cell) => {
          cell.style.width =
            target.value === "-1" ? "auto" : target.value + "px";
        });
      this.dependencies.TableManager.saveTable();
      this.dependencies.TableManager.update();
    }
    if (target && target.name === "height") {
      this.dependencies.TableManager.selected
        .flatMap((cell) => {
          if (cell.type === "th") {
            return this.dependencies.TableManager.getHeadRowBy(cell.y);
          } else {
            return this.dependencies.TableManager.getBodyRowBy(cell.y);
          }
        })
        .forEach((cell) => {
          cell.style.height =
            target.value === "-1" ? "auto" : target.value + "px";
        });
      this.dependencies.TableManager.saveTable();
      this.dependencies.TableManager.update();
    }
  }
}
