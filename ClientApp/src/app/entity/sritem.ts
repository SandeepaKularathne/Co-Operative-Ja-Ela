import { Item } from "./item";

export class Sritem {

  public id !: number;
  public qty !: number;
  public item !: Item;


  constructor(id: number, item:Item, qty: number) {
    this.id = id;
    this.qty = qty;
    this.item = item;
  }

}
