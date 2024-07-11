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
    { name: 'Program', accessFlag: true, routerLink: 'program' }
  ];

  saleMenuItems = [
    { name: 'Student', accessFlag: true, routerLink: 'students' }
  ];

  disMenuItems = [
    { name: 'Vehicle', accessFlag: true, routerLink: 'vehicle' }
  ];

  invMenuItems = [
    { name: 'Attendance', accessFlag: true, routerLink: 'attendance' }
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

    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStoragePurMenus, JSON.stringify(this.purMenuItems));
    localStorage.setItem(this.localStorageSaleMenus, JSON.stringify(this.saleMenuItems));
    localStorage.setItem(this.localStorageDisMenus, JSON.stringify(this.disMenuItems));
    localStorage.setItem(this.localStorageInvMenus, JSON.stringify(this.invMenuItems));

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
        console.log(authorities);

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
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}
