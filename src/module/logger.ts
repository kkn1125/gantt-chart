export default class Logger {
  context: string = "system";

  constructor(context?: string) {
    context && (this.context = context);

    this.log = console.log.bind(
      console,
      `%c[${this.context.toUpperCase()}]`,
      "color: skyblue"
    );
    this.debug = console.debug.bind(
      console,
      `%c[${this.context.toUpperCase()}]`,
      "color: coral"
    );
  }

  log = console.log.bind(console, `[${this.context.toUpperCase()}]`);
  debug = console.debug.bind(console, `[${this.context.toUpperCase()}]`);
}
