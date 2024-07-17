import { Item } from "./item";

export class Poitem {

  public id !: number;
  public qty !: number;
  public explinetotal !: number;
  public item !: Item;

  constructor(id: number, qty: number, explinetotal: number, item: Item) {
    this.id = id;
    this.qty = qty;
    this.explinetotal = explinetotal;
    this.item = item;
  }

}
