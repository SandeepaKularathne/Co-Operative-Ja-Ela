import { Grn } from "./grn";
import { Item } from "./item";
import { Store } from "./store";

export class Grnitem {

  public id !: number;
  public unitcost !: number;
  public qty !: number;
  public linecost !: number;
  public item !: Item;
  public store !: Store;

  constructor(id: number, item:Item, unitcost: number, qty: number, store:Store, linecost : number) {
    this.id = id;
    this.unitcost = unitcost;
    this.qty = qty;
    this.linecost = linecost;
    this.item = item;
    this.store = store;
  }

}
