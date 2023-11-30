export default class Dependencies<T> {
  moduleName: string;
  dependencies!: {
    [t in keyof T]: T;
  };

  constructor(t: T) {
    this.moduleName = (t as object).constructor.name;
    if (typeof t === "object" && t != null) {
      this.dependencies[t.constructor.name as keyof T] = t;
    } else {
      throw new Error("cannot add a dependencies of type " + t);
    }
  }
}
