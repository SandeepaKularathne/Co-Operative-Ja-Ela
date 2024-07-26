import { Employee } from "./employee";
import { Grn } from "./grn";
import { Grnitem } from "./grnitem";
import { Grnstatus } from "./grnstatus";
import { Purorder } from "./purorder";
import { Supplier } from "./supplier";
import { Supreitem } from "./supreitem";

export class Supreturn{

  public id !: number;
  public date !: string;
  public reason !: string;
  public returnno !: string;
  public grandtotal !: number;
  public grn !: Grn;
  public supplier !: Supplier;
  public supreitems !: Array<Supreitem>;
  public employee !: Employee;

  constructor(id: number, date: string, reason: string, returnno: string, grandtotal: number, grn:Grn, supplier:Supplier, supreitems: Array<Supreitem>,employee:Employee) {
    this.id = id;
    this.date = date;
    this.reason = reason;
    this.returnno = returnno;
    this.grandtotal = grandtotal;
    this.grn = grn;
    this.supplier = supplier;
    this.supreitems = supreitems;
    this.employee = employee;
  }

}





