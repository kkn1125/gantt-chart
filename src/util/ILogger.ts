import { Logger } from "./Logger";

export class ILogger {
  protected readonly logger: Logger = new Logger();
}
