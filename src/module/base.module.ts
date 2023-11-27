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
      [module.constructor.name]: module,
    });
  }

  bulkInjection(modules: Dependency[keyof Dependency][]) {
    this.logger.process("bulk injection modules", modules);

    Object.assign(
      this.dependencies,
      Object.fromEntries(
        modules.map((module) => [module.constructor.name, module])
      )
    );
  }

  createEl(element: string) {
    return document.createElement(element);
  }
}
