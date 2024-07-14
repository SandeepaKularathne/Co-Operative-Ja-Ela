import {Category} from "./category";
import {Supplier} from "./supplier";

export class Supplierstatus {

  public id !: number;
  public category !: Category;
  public supplier !: Supplier;


  constructor(id: number, category: Category, supplier: Supplier) {
    this.id = id;
    this.category = category;
    this.supplier = supplier;
  }
}
