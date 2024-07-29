import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';

@Injectable()
export class AuthorizationManager {

  private readonly localStorageUsreName = 'username';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageAdmMenus = 'admMenuState';
  private readonly localStoragePurMenus = 'purMenuState';
  private readonly localStorageSaleMenus = 'saleMenuState';
  private readonly localStorageDisMenus = 'disMenuState';
  private readonly localStorageInvMenus = 'invMenuState';
  private readonly localStorageRepMenus = 'repMenuState';

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  admMenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' },
    { name: 'Operations', accessFlag: true, routerLink: 'operation' }
  ];

  purMenuItems = [
    { name: 'Purchase Order', accessFlag: true, routerLink: 'purorder' },
    { name: 'Supplier Payment', accessFlag: true, routerLink: 'supayment' },
    { name: 'Supplier Return', accessFlag: true, routerLink: 'supreturn' },
    { name: 'Supplier', accessFlag: true, routerLink: 'supplier' }
  ];

  saleMenuItems = [
    { name: 'Customer Registration', accessFlag: true, routerLink: 'customer' },
    { name: 'Customer Payment', accessFlag: true, routerLink: 'payment' },
    { name: 'Customer Return', accessFlag: true, routerLink: 'customerreturn' },
    { name: 'Invoice', accessFlag: true, routerLink: 'invoice' },
    { name: 'Income Deposits', accessFlag: true, routerLink: 'incomedeposits' }
  ];

  disMenuItems = [
    { name: 'Vehicle', accessFlag: true, routerLink: 'vehicle' },
    { name: 'Shop', accessFlag: true, routerLink: 'shop' },
    { name: 'Route', accessFlag: true, routerLink: 'route' },
    { name: 'Distribution Order', accessFlag: true, routerLink: 'distributionorder' },
    { name: 'Distribution Receives', accessFlag: true, routerLink: 'distributionreceives' },
    { name: 'Distribution Request', accessFlag: true, routerLink: 'disrequests' }
  ];

  invMenuItems = [
    { name: 'Item', accessFlag: true, routerLink: 'item' },
    { name: 'Goods Received Note', accessFlag: true, routerLink: 'grn' },
    { name: 'Store', accessFlag: true, routerLink: 'store' },
    { name: 'Store Return', accessFlag: true, routerLink: 'storereturn' }
  ];

  repMenuItems = [
    { name: 'Purchase', accessFlag: true, routerLink: 'purchase' },
    { name: 'Sale', accessFlag: true, routerLink: 'countbycrdate' },
    { name: 'Distribution', accessFlag: true, routerLink: 'countbyvehiclestatus' },
    { name: 'Inventory', accessFlag: true, routerLink: 'inventory' }
  ];


  constructor(private am: AuthoritySevice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }

  enableMenues(modules: { module: string; operation: string }[]): void {
    this.admMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.purMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.saleMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.disMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.invMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.repMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStoragePurMenus, JSON.stringify(this.purMenuItems));
    localStorage.setItem(this.localStorageSaleMenus, JSON.stringify(this.saleMenuItems));
    localStorage.setItem(this.localStorageDisMenus, JSON.stringify(this.disMenuItems));
    localStorage.setItem(this.localStorageInvMenus, JSON.stringify(this.invMenuItems));
    localStorage.setItem(this.localStorageRepMenus, JSON.stringify(this.repMenuItems));

  }


  async getAuth(username: string): Promise<void> {

    this.setUsername(username);

    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });
        //console.log(authorities);

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const admMenuState = localStorage.getItem(this.localStorageAdmMenus);
    if (admMenuState) {
      this.admMenuItems = JSON.parse(admMenuState);
    }

    const purMenuState = localStorage.getItem(this.localStoragePurMenus);
    if (purMenuState) {
      this.purMenuItems = JSON.parse(purMenuState);
    }

    const saleMenuState = localStorage.getItem(this.localStorageSaleMenus);
    if (saleMenuState) {
      this.saleMenuItems = JSON.parse(saleMenuState);
    }

    const disMenuState = localStorage.getItem(this.localStorageDisMenus);
    if (disMenuState) {
      this.disMenuItems = JSON.parse(disMenuState);
    }

    const invMenuState = localStorage.getItem(this.localStorageInvMenus);
    if (invMenuState) {
      this.invMenuItems = JSON.parse(invMenuState);
    }

    const repMenuState = localStorage.getItem(this.localStorageInvMenus);
    if (repMenuState) {
      this.repMenuItems = JSON.parse(repMenuState);
    }
  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdmMenus);
    localStorage.removeItem(this.localStoragePurMenus);
    localStorage.removeItem(this.localStorageSaleMenus);
    localStorage.removeItem(this.localStorageDisMenus);
    localStorage.removeItem(this.localStorageInvMenus);
    localStorage.removeItem(this.localStorageRepMenus);
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}
