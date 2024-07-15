import { Item } from "./item";
import { Purorder } from "./purorder";

export class Poitem {

  public id !: number;
  public qty !: string;
  public explinetotal !: number;
  public item !: Item;
  public purorder !: Purorder;

  constructor(id: number, qty: string, explinetotal: number, item: Item, purorder: Purorder) {
    this.id = id;
    this.qty = qty;
    this.explinetotal = explinetotal;
    this.item = item;
    this.purorder = purorder;
  }
  
}
