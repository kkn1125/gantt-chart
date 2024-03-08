export default class DropdownMenuItem {
  originGroup: string;
  originName: string;

  parent: DropdownMenuItem | null = null;
  group: string;
  name: string;
  feature: Function = () => {};
  menuItems: DropdownMenuItem[] = [];

  isOpen: boolean = false;

  constructor(group: string, name: string, feature?: Function) {
    this.group = group;
    this.name = name;

    feature && (this.feature = feature.bind(feature, this));

    this.originGroup = group;
    this.originName = name;
  }

  setName(name: string) {
    this.name = name;
  }

  initName() {
    this.name = this.originName;
  }

  initGroup() {
    this.group = this.originGroup;
  }

  addSubMenuItem(dropdownMenuItem: DropdownMenuItem) {
    dropdownMenuItem.parent = this;
    this.menuItems.push(dropdownMenuItem);
  }

  addMenuItem(dropdownMenuItem: DropdownMenuItem) {
    dropdownMenuItem.parent = this;
    dropdownMenuItem.group = this.group;
    this.menuItems.push(dropdownMenuItem);
  }

  open() {
    this.isOpen = true;
    this.menuItems.forEach((menuItem) => menuItem.open());
  }

  close() {
    this.isOpen = false;
    this.menuItems.forEach((menuItem) => menuItem.close());
  }

  findTab(tabName: string): DropdownMenuItem | undefined {
    return this.menuItems.find((menu) => {
      if (menu.group === tabName) {
        menu.open();
        return menu;
      } else {
        return menu.findTab(tabName);
      }
    });
  }

  findTabByName(name: string): DropdownMenuItem | undefined {
    let temp: DropdownMenuItem | null = null;
    if (this.name === name) {
      temp = this;
    } else {
      this.menuItems.forEach((menu) => {
        const result = menu.findTabByName(name);
        if (result) {
          temp = result;
        }
      });
    }

    if (temp) {
      return temp;
    }
    return;
  }
}
