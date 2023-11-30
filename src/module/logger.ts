export default class Logger {
  context!: string;

  log!: (...arg: any[]) => void;
  debug!: (...arg: any[]) => void;
  error!: (...arg: any[]) => void;
  process!: (...arg: any[]) => void;
  check!: (...arg: any[]) => void;

  constructor(context: string = "system") {
    this.setContext(context);
  }

  setContext(context: string) {
    if (!import.meta.env.DEV) {
      this.log = () => {};
      this.debug = () => {};
      this.error = () => {};
      this.process = () => {};
      this.check = () => {};
    } else {
      this.context = context;
      this.log = console.log.bind(
        console,
        `%c[${this.context.toUpperCase()}]`,
        `color: skyblue; padding-right: 0.5rem;`
      );
      this.debug = console.debug.bind(
        console,
        `%c[${this.context.toUpperCase()}]`,
        `color: coral; padding-right: 0.5rem;`
      );
      this.error = console.error.bind(
        console,
        `%c[PROCESS|${this.context.toUpperCase()}]`,
        `color: #ef525c; padding-right: 0.5rem;`
      );
      this.process = console.info.bind(
        console,
        `%c[PROCESS|${this.context.toUpperCase()}]`,
        `color: #6beb9a; padding-right: 0.5rem;`
      );
      this.check = console.info.bind(
        console,
        `%c[🛠️CHECK|${this.context.toUpperCase()}]`,
        `color: #6beb9a; padding-right: 0.5rem;`
      );
    }
  }
}
