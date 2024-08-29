import dayjs from "dayjs";

export class Logger {
  private context: string = "LOG";

  private levels = ["log", "info", "debug", "warn", "error", "fatal"] as const;

  log!: (...messages: string[]) => void;
  info!: (...messages: string[]) => void;
  debug!: (...messages: string[]) => void;
  warn!: (...messages: string[]) => void;
  error!: (...messages: string[]) => void;
  fatal!: (...messages: string[]) => void;

  constructor();
  constructor(context: string);
  constructor(context?: string) {
    context && (this.context = context);
    this.update();
  }

  private sign(level: (typeof this.levels)[number]) {
    switch (level) {
      case "log":
        return "🪵";
      case "info":
        return "✨";
      case "debug":
        return "🐛";
      case "warn":
        return "⚠️";
      case "error":
        return "🔥";
      case "fatal":
        return "💥";
      default:
        return "🪵";
    }
  }

  private update() {
    const self = this;
    for (const level of this.levels) {
      Object.defineProperty(this, level, {
        get() {
          return console.debug.bind(
            self,
            self.sign(level),
            `[ ${level.toUpperCase()} ]`.padEnd(18 - level.length, " "),
            `[ ${dayjs(new Date()).format("HH:mm:ss.SSS")} ]`,
            `[ ${self.context.toUpperCase()} ]`,
            " ─── "
          );
        },
      });
    }
  }

  public setContext(context: string) {
    this.context = context;
    this.update();
  }
}
