import { Grn } from "./grn";
import { Item } from "./item";
import { Store } from "./store";

export class Supreitem {

  public id !: number;
  public qty !: number;
  public item !: Item;


  constructor(id: number, item:Item, qty: number) {
    this.id = id;
    this.qty = qty;
    this.item = item;
  }

}
