import dayjs from "dayjs";

export class Logger<T extends object> {
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
  constructor(context: T);
  constructor(context?: string | T) {
    this.setContext(context as string & T);
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
            `[ ${level.toUpperCase()} ]`,
            `[ ${dayjs(new Date()).format("HH:mm:ss.SSS")} ]`,
            `[ ${self.context.toUpperCase()} ]`,
            " ─── "
          );
        },
      });
    }
  }

  public setContext(): void;
  public setContext(context: string): void;
  public setContext(context: T): void;
  public setContext(context?: string | T) {
    if (context) {
      if (typeof context !== "string" && "constructor" in context) {
        this.context = context.constructor.name as string;
      } else if (typeof context === "string") {
        this.context = context;
      }
    }
    this.update();
  }
}
