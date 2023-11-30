import { createEl } from "@/util/global";
import Logger from "./logger";

export default class BaseModule {
  logger: Logger;
  dependencies!: Dependency;
  subColor: string = "#ffffff";

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.logger.process("initialize", this.constructor.name);

    Object.assign(this, { dependencies: {} });
  }

  inject(module: Dependency[keyof Dependency]) {
    Object.assign(this.dependencies, {
      [(module as object).constructor.name]: module,
    });
  }

  bulkInjection(modules: Dependency[keyof Dependency][]) {
    this.logger.process("bulk injection modules", modules);

    modules.forEach((module) => {
      this.inject(module);
    });
  }

  createEl(element: string) {
    return createEl(element);
  }
}
