import { EventManager } from "@model/event/EventManager";
import { Logger } from "./util/Logger";
import { UI } from "@model/ui/UI";
import { MainPage } from "@model/ui/MainPage";
import { Tree } from "@model/menu/Tree";
import { Branch } from "@model/menu/Branch";
import { Leaf } from "@model/menu/Leaf";

const logger = new Logger("main");

function run() {
  const eventManager = new EventManager();
  const mainUi = new UI(new MainPage("#app"));
  mainUi.run();

  const saveLeaf = new Leaf("save");
  const optionBranch = new Branch("files");
  optionBranch.addLeaf(saveLeaf);
  const tree = new Tree("options");
  tree.addBranch(optionBranch);
  const treeUi = new UI(tree);
  treeUi.run();

  logger.log("app started.");
}

run();
