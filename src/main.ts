import { UI } from "@model/ui/ui";
import { Logger } from "./util/logger";
import { EventManager } from "@model/event/event.manager";

const logger = new Logger("main");

function run() {
  const eventManager = new EventManager();
  const ui = new UI();
  ui.render();
  logger.info("start app");
}
