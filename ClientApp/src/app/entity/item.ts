import {Itemstatus} from "./itemstatus";
import {Unittype} from "./unittype";
import { Itembrand } from "./itembrand";
import { Supplier } from "./supplier";
import { Subcategory } from "./subcategory";

export class Item {

  public id !: number;
  public name !: string;
  public sprice!: number;
  public pprice!: number;
  public poto !: string;
  public itemnumber !: string;
  public quantity!: number;
  public rop !: number;
  public dointroduced !: string;
  public subcategory !: Subcategory;
  public itembrand !: Itembrand;
  public itemstatus !: Itemstatus;
  public unittype !: Unittype;
  public supplier !: Supplier;

  constructor(id: number, name: string, sprice: number, pprice: number, poto: string, itemnumber: string, quantity: number, rop: number, dointroduced: string, subcategory: Subcategory, itembrand: Itembrand, itemstatus: Itemstatus, unittype: Unittype, supplier: Supplier) {
    this.id = id;
    this.name = name;
    this.sprice = sprice;
    this.pprice = pprice;
    this.poto = poto;
    this.itemnumber = itemnumber;
    this.quantity = quantity;
    this.rop = rop;
    this.dointroduced = dointroduced;
    this.subcategory = subcategory;
    this.itembrand = itembrand;
    this.itemstatus = itemstatus;
    this.unittype = unittype;
    this.supplier = supplier;
  }

}
