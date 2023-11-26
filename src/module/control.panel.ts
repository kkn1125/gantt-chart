import Logger from "./logger";

export default class ControlPanel {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.logger.debug("initialize control panel");
  }
}
