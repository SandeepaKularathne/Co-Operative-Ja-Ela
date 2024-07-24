import { Item } from "./item";

export class Iteminvoice {

  public id !: number;
  public qty !: number;
  public linetotal !: number;
  public item !: Item;

  constructor(id: number, item:Item,qty: number,linetotal: number) {
    this.id = id;
    this.qty = qty;
    this.linetotal = linetotal;
    this.item = item;
  }


}
