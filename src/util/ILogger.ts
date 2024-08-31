import { Logger } from "./Logger";

export class ILogger {
  protected readonly logger: Logger<this> = new Logger();
}
