import BaseModule from "./base.module";
import Logger from "./logger";

export default class EventManager extends BaseModule {
  logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(this.constructor.name);
    this.logger.debug("initialize event manager");

    this.initialize();
  }

  initialize() {
    window.addEventListener("keydown", this.handleKeydown.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
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
