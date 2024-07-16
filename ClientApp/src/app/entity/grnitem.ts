import { Grn } from "./grn";
import { Item } from "./item";
import { Store } from "./store";

export class Grnitem {

  public id !: number;
  public unitcost !: number;
  public qty !: number;
  public linecost !: number;
  public grn !: Grn;
  public item !: Item;
  public store !: Store;

  constructor(id: number, unitcost: number, qty: number, linecost: number, grn:Grn, item:Item, store:Store) {
    this.id = id;
    this.unitcost = unitcost;
    this.qty = qty;
    this.linecost = linecost;
    this.grn = grn;
    this.item = item;
    this.store = store;
  }
  
}
