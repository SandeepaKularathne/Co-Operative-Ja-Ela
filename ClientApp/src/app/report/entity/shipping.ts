export class Shipping {

  public id !: number;
  public shopnumber !: string;
  public root !: string;
  public num !: string;


  constructor(id: number, shopnumber: string, root: string, num: string) {
    this.id = id;
    this.shopnumber = shopnumber;
    this.root = root;
    this.num = num;
  }
}
