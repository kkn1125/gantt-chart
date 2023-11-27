import BaseModule from "./base.module";

export default class EventManager extends BaseModule {
  constructor() {
    super();
  }

  initialize() {
    window.addEventListener("keydown", this.handleKeydown.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    window.addEventListener("mousedown", this.handleSelectStart.bind(this));
    window.addEventListener("mouseup", this.handleSelectEnd.bind(this));
  }

  handleSelectStart(e: MouseEvent) {
    const target = e.target as HTMLTableCellElement;
    if (target && target.classList.contains("cell")) {
      const cell = this.dependencies.TableManager.findCellById(
        +(target.dataset.id as string),
        target.dataset.type as string
      );
      if (cell) {
        this.logger.debug(cell);
        this.dependencies.TableManager.selected.push(cell);
      } else {
      }
    }
  }

  handleSelectEnd(e: MouseEvent) {
    const target = e.target as HTMLTableCellElement;
    if (target && target.classList.contains("cell")) {
      const cell = this.dependencies.TableManager.findCellById(
        +(target.dataset.id as string),
        target.dataset.type as string
      );
      if (cell) {
        this.logger.debug(cell);
        this.dependencies.TableManager.selected.push(cell);
        this.dependencies.TableManager.highlightSelectedCells();
      } else {
      }
    }
  }

  handleDoubleClick(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("cell")) {
      function handleCellKeydown(this: EventManager, ev: KeyboardEvent) {
        if (ev.shiftKey && ev.key === "Enter") {
          this.logger.debug("save");
          target.contentEditable = "false";
          save.bind(this);
        }
      }
      function handleCellInput(this: EventManager /* ev: Event */) {
        const cell = this.dependencies.TableManager.findCellById(
          +(target.dataset.id as string),
          target.dataset.type as string
        );
        console.log(target, cell);
        if (cell) {
          cell.setContent(target.innerText);
        }
      }
      function save(this: EventManager) {
        target.removeEventListener("keydown", handleCellKeydown.bind(this));
        target.removeEventListener("input", handleCellInput.bind(this));

        console.log(this.dependencies.TableManager);
        this.dependencies.TableManager.saveData();
        this.dependencies.StorageManager.saveStorage();
      }

      target.contentEditable = "true";
      target.focus();
      target.addEventListener("keydown", handleCellKeydown.bind(this));
      target.addEventListener("input", handleCellInput.bind(this));
    }
  }

  handleKeydown(e: KeyboardEvent) {
    const key = e.key;

    if (key === "a") {
      this.logger.log(this.dependencies.Ui);
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
      this.dependencies.Ui.selectSheet(+(target.dataset?.sheetId || 0));
    }
  }

  handleMouseMove(e: MouseEvent) {
    const target = e.target as HTMLDivElement;

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

    // if (!(target.dataset.tool || target.dataset.toolItem)) {
    //   this.dependencies.Ui.dropdownHovered = false;

    //   // this.dependencies.Ui.dropdownOpen(
    //   //   e,
    //   //   target.dataset.tool as "tool" | "file" | "about"
    //   // );
    // }

    // if (
    //   this.dependencies.Ui.isDropdownOpened() &&
    //   this.dependencies.Ui.dropdownHovered
    // ) {
    //   this.dependencies.Ui.dropdownClose();
    //   this.dependencies.Ui.dropdownOpen(
    //     e,
    //     target.dataset.tool as "tool" | "file" | "about"
    //   );
    // }
  }
}
