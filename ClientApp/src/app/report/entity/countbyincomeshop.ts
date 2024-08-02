export class CountByIncomeShop {

  public id !: number;
  public year !: number;
  public month !: number;
  public shop !: string;
  public tcount !: number

  constructor(year: number, month: number, shop: string, tcount: number) {
    this.year = year;
    this.month = month;
    this.shop = shop;
    this.tcount = tcount;
  }

}
