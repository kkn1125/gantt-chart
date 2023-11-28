import { PANEL } from "@/util/global";
import BaseModule from "./base.module";

type Item = {
  title: string;
  panel: HTMLElement | string;
};

interface Menu {
  title: string;
  item: Item[];
}

interface MenuList {
  common: Menu[];
}

export default class PanelManager extends BaseModule {
  private menuList: MenuList = {
    common: [],
  };
  menuName: keyof MenuList = "common";
  currentMenu: Menu[] = [];
  width: number | string = "30%";

  previewColor = {
    r: 56,
    g: 125,
    b: 36,
    a: 255,
  };

  constructor() {
    super();

    this.menuList.common.push({
      title: "기본 스타일",
      item: [
        {
          title: "색상 조절",
          panel: `
        <div>preview</div>
        <div id="preview-color">

        </div>
        <div class="palette">
          <input class="rgba" name="r" type="range" min="0" max="255" value="${this.previewColor.r}" />
          <input class="rgba" name="g" type="range" min="0" max="255" value="${this.previewColor.g}" />
          <input class="rgba" name="b" type="range" min="0" max="255" value="${this.previewColor.b}" />
          <input class="rgba" name="a" type="range" min="0" max="255" value="${this.previewColor.a}" />
        </div>
      `,
        },
      ],
    });
  }

  setWidth(width: number | string) {
    this.width = width;
  }

  setCurrentMenu(menu: keyof MenuList) {
    this.menuName = menu;
    this.loadMenu();
  }

  initialize() {
    this.logger.process("initialize panel manager");

    this.loadMenu();
    this.update();
  }

  loadMenu() {
    this.currentMenu = this.menuList[this.menuName];
  }

  openPanel() {
    this.dependencies.Ui.openPanel(this.width);
    this.previewUpdate();
  }

  closePanel() {
    this.dependencies.Ui.closePanel();
    // 하...
    // this.dependencies.TableManager.initSelected();
  }

  isOpened() {
    return PANEL.classList.contains("open");
  }

  clearPanel() {
    PANEL.innerHTML = "";
  }

  previewUpdate() {
    const previewColor = document.querySelector(
      "#preview-color"
    ) as HTMLDivElement;

    previewColor.style.backgroundColor = this.getBackgroundColor();
    // this.logger.log("hex", previewColor.style.backgroundColor);
  }

  getBackgroundColor() {
    const { r, g, b, a } = this.previewColor;
    return `#${this.convertHex(r)}${this.convertHex(g)}${this.convertHex(
      b
    )}${this.convertHex(a)}`;
  }

  convertHex(value: number) {
    return parseInt("" + value)
      .toString(16)
      .padStart(2, "0");
  }

  update() {
    this.logger.debug("update panel");
    this.clearPanel();
    const menuWrap = this.createEl("div");
    menuWrap.classList.add("menu-wrap");

    this.currentMenu.forEach((menu) => {
      const title = this.createEl("div");
      title.classList.add("menu-title");
      title.innerText = menu.title;
      menuWrap.append(title);

      const menuList = this.createEl("div");
      menuList.classList.add("menu-list");

      menu.item.forEach((item) => {
        const menu = this.createEl("div");
        menu.classList.add("panel");
        const menuTitle = this.createEl("div");
        menuTitle.classList.add("panel-title");
        menuTitle.innerText = item.title;

        if (item.panel instanceof HTMLElement) {
          item.panel.classList.add("panel-tool");
        } else {
          const els = [
            ...new DOMParser().parseFromString(item.panel, "text/html").body
              .children,
          ];
          item.panel = this.createEl("div");
          item.panel.append(...els);
        }

        menu.append(menuTitle);
        menu.append(item.panel);

        menuList.append(menu);
      });
      menuWrap.append(menuList);
    });
    PANEL.append(menuWrap);
  }
}
