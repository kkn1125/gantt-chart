import { EventManager } from "@model/event/EventManager";
import { Logger } from "./util/Logger";
import { UI } from "@model/ui/UI";
import { MainPage } from "@model/ui/MainPage";

const logger = new Logger("main");

function run() {
  const eventManager = new EventManager();
  const ui = new UI(new MainPage());

  ui.run();

  logger.log("app started.");
}

run();
