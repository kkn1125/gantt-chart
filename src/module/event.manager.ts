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
    this.dependencies.TableManager.selected = [];
  }

  removeContentEditable() {
    this.logger.debug("cancel");
    document.querySelectorAll(`[contenteditable]`).forEach((cell) => {
      cell.removeAttribute("contenteditable");
    });
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

  handleContextMenu(e: MouseEvent) {
    if (e.button === 2) {
      // right click
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLTableCellElement;
      if (target && target.classList.contains("cell")) {
        if (!this.isOpenedPanel()) {
          this.openPanel();
        }
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
      this.initializeSelectedInTableCells();
      // this.dependencies.TableManager.selected = [];
    }

    const target = e.target as HTMLTableCellElement;
    if (target && target.classList.contains("cell")) {
      const cell = this.dependencies.TableManager.findCellById(
        +(target.dataset.id as string),
        target.dataset.type as string
      );
      if (cell) {
        this.logger.check("check cell");
        this.dependencies.TableManager.selected.push(cell);
        this.dependencies.Ui.startDrawDragRect(e);
      } else {
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    this.dependencies.Ui.movingDrawDragRect(e);

    if (target.dataset.tool || target.closest("#menu-list")) {
      this.dependencies.Ui.dropdownHovered = true;
    }

    if (
      this.dependencies.Ui.isChangedBeforeTool(
        (target.dataset.tool || target.dataset.toolItem) as DropdownMenuNames
      ) &&
      this.dependencies.Ui.dropdownOpened
    ) {
      this.dependencies.Ui.dropdownClose();
      this.dependencies.Ui.dropdownOpen(
        e,
        (target.dataset.tool || target.dataset.toolItem) as DropdownMenuNames
      );
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
      console.log('dragging', this.dependencies.Ui.dragUiActivate);
      if (cell && this.dependencies.Ui.dragUiActivate) {
        if (this.dependencies.TableManager.hasSelected(cell)) {
          this.logger.check("selected had cell", cell);
        }
        this.dependencies.TableManager.selected.push(cell);
        this.dependencies.TableManager.highlightSelectedCells();
      }
    } else {
      console.log(target.closest("#panel"));
      if (target && !target.closest("#panel")) {
        this.initializeSelectedInTableCells();
      }
    }
    this.dependencies.Ui.endDrawDragRect(e);
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
    console.log(this.editingEl, cell);
    if (cell) {
      cell.setContent(this.editingEl.innerText);
    }
  }

  handleKeydown(e: KeyboardEvent) {
    const key = e.key;

    // if (key === "a") {
    //   this.logger.log(this.dependencies.Ui);
    // }

    if (this.editingEl) {
      if (e.shiftKey && key === "Enter") {
        this.removeContentEditableAndSave();
        this.editingEl.removeEventListener("input", this.handleCellInput);
      }
      if (key === "Escape") {
        this.removeContentEditable();
        this.editingEl.removeEventListener("input", this.handleCellInput);
      }
    }

    if (key === "Escape") {
      if (this.isOpenedPanel()) {
        this.closePanel();
      }
    }
  }

  handleKeyup(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    if (target && target.classList.contains("rgba")) {
      const rgbaName = target.name as keyof PanelManager["previewColor"];
      this.dependencies.PanelManager.previewColor[rgbaName] = +target.value;
      this.dependencies.PanelManager.previewUpdate();
    }
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target && target.classList.contains("rgba")) {
      const rgbaName = target.name as keyof PanelManager["previewColor"];
      this.dependencies.PanelManager.previewColor[rgbaName] = +target.value;
      this.dependencies.PanelManager.previewUpdate();

      this.dependencies.TableManager.selected.forEach((cell) => {
        console.log("loop", cell);
        Object.assign(cell.style, {
          backgroundColor: this.dependencies.PanelManager.getBackgroundColor(),
        });
        // cell.style.backgroundColor =
        //   this.dependencies.PanelManager.getBackgroundColor();
      });

      this.dependencies.TableManager.saveTable();
      this.dependencies.TableManager.update();
    }
  }

  handleClick(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (
      target.dataset.tool !== undefined &&
      this.dependencies.Ui.dropdownHovered &&
      !this.dependencies.Ui.dropdownOpened
    ) {
      this.dependencies.Ui.dropdownOpen(
        e,
        target.dataset.tool as DropdownMenuNames,
        target.dataset.toolItemName as string
      );
    } else {
      this.dependencies.Ui.dropdownClose();
      if (target.dataset.toolItemName) {
        this.dependencies.Ui.eventCommit(target.dataset);
      }
    }

    if (target && target.classList.contains("sheet")) {
      const id = +(target.dataset.sheetId || 0);
      console.log(id);
      this.dependencies.TableManager.swapSheet(id);
    }

    if (target && target.classList.contains("cell")) {
    } else {
      if (this.editingEl) {
        this.removeContentEditableAndSave();
        this.editingEl.removeEventListener("input", this.handleCellInput);
      }
    }

    if (target && !target.closest("#panel")) {
      if (this.isOpenedPanel()) {
        this.closePanel();
      }
    }
  }
}
