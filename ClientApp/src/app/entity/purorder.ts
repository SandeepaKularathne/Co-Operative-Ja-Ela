import { Employee } from "./employee";
import { Poitem } from "./poitem";
import { Postatus } from "./postatus";
import { Supplier } from "./supplier";

export class Purorder {

  public id !: number;
  public ponumber !: string;
  public date !: string;
  public expectedcost !: number;
  public description !: string;
  public postatus !: Postatus;
  public employee !: Employee;
  public poitems !: Array<Poitem>;
  public supplier !: Array<Supplier>;

  constructor(id: number, ponumber: string, date: string, expectedcost: number, description: string, postatus:Postatus, employee:Employee, poitems: Array<Poitem>,supplier: Array<Supplier>) {
    this.id = id;
    this.ponumber = ponumber;
    this.date = date;
    this.expectedcost = expectedcost;
    this.description = description;
    this.postatus = postatus;
    this.employee = employee;
    this.poitems = poitems;
    this.supplier = supplier;
  }

}
