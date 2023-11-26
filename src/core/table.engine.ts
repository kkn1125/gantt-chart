import Logger from "@/module/logger";

export default class TableEngine {
  logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.logger.debug("initialize", this.constructor.name);
  }
}
