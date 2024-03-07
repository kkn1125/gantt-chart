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
  /* 추후 확장 기능 */
  menuName: keyof MenuList = "common";
  currentMenu: Menu[] = [];
  width: number | string = "450px";

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
          title: "셀 추가 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="" data-cell-add="left"><box-icon name='left-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="right"><box-icon name='right-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="top"><box-icon name='up-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="bottom"><box-icon name='down-arrow-alt'></box-icon></button>
        </div>
      `,
        },
        {
          title: "셀 혼합 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="cell-concat-button" data-dir="all">concat</button>
          <button class="cell-concat-button" data-dir="split">split</button>
        </div>
      `,
        },
        {
          title: "색상 조절",
          panel: `
        <div>preview</div>
        <div id="preview-color"></div>
        <div class="palette">
          <input class="rgba" name="r" type="range" min="0" max="255" />
          <input class="rgba" name="g" type="range" min="0" max="255" />
          <input class="rgba" name="b" type="range" min="0" max="255" />
          <input class="rgba" name="a" type="range" min="0" max="255" />
        </div>
      `,
        },
      //   {
      //     title: "테두리 그리기 제어",
      //     panel: `
      //   <div>border</div>
      //   <div class="border-onoff">
      //     <label>
      //       <input type="checkbox"></input>
      //       top
      //     </label>
      //     <div class="centered">
      //       <label>
      //         <input type="checkbox"></input>
      //         left
      //       </label>
      //         <label>
      //           <input type="checkbox"></input>
      //           all
      //         </label>
      //         <label>
      //           <input type="checkbox"></input>
      //           right
      //         </label>
      //     </div>
      //     <label>
      //       <input type="checkbox"></input>
      //       bottom
      //     </label>
      //   </div>
      // `,
      //   },
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
    this.previewUpdate();
    this.dependencies.Ui.openPanel(this.width);
    const rgbaTool = document.querySelector(".palette");
    if (rgbaTool) {
      this.logger.log(rgbaTool);
      const r = rgbaTool.querySelector('[name="r"]') as HTMLInputElement;
      const g = rgbaTool.querySelector('[name="g"]') as HTMLInputElement;
      const b = rgbaTool.querySelector('[name="b"]') as HTMLInputElement;
      const a = rgbaTool.querySelector('[name="a"]') as HTMLInputElement;
      r.value = "" + this.previewColor.r;
      g.value = "" + this.previewColor.g;
      b.value = "" + this.previewColor.b;
      a.value = "" + this.previewColor.a;
    }
  }

  closePanel() {
    this.dependencies.Ui.closePanel();
    // this.dependencies.TableManager.initSelected();
  }

  isOpened() {
    return PANEL.classList.contains("open");
  }

  isOpenedSheetTool() {
    return !!document.querySelector("#sheet-tool");
  }

  clearPanel() {
    PANEL.innerHTML = "";
  }

  initializeCellBackgroudColorSet() {
    const defaultColor = "#00000000";
    const cells = this.dependencies.TableManager.selected;
    const bgMap = cells.map(
      (cell) => cell.style.backgroundColor || defaultColor
    );
    const keyArray: string[] = [];
    const countArray: number[] = [];
    [...new Set(bgMap)].forEach((bg) => {
      keyArray.push(bg);
      countArray.push(0);
    });
    for (const bg of bgMap) {
      countArray[keyArray.indexOf(bg)] += 1;
    }
    const sorted = [...keyArray].sort((a, b) => {
      return countArray[keyArray.indexOf(b)] - countArray[keyArray.indexOf(a)];
    });
    const initialColor =
      (sorted[0] === defaultColor ? sorted[1] : sorted[0]) || defaultColor;
    this.previewColor = this.parseHexToRGBA(initialColor);
  }

  parseHexToRGBA(hex: string) {
    const [r, g, b, a] = hex
      .slice(1)
      .replace(/\B(?=(.{2})+(?!.))/g, " ")
      .split(" ");
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: parseInt(a, 16),
    };
  }

  previewUpdate() {
    const previewColor = document.querySelector(
      "#preview-color"
    ) as HTMLDivElement;

    previewColor.style.boxShadow =
      "inset 0 0 0 99999999999px" + this.getBackgroundColor();
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
