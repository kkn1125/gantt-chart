export default class BaseModule {
  dependencies!: Dependency;

  constructor() {
    Object.assign(this, { dependencies: {} });
  }

  inject(module: Dependency[keyof Dependency]) {
    Object.assign(this.dependencies, {
      [module.constructor.name]: module,
    });
  }

  bulkInjection(modules: Dependency[keyof Dependency][]) {
    Object.assign(
      this.dependencies,
      Object.fromEntries(
        modules.map((module) => [module.constructor.name, module])
      )
    );
  }
}
