import { Employee } from "./employee";
import { Grnitem } from "./grnitem";
import { Grnstatus } from "./grnstatus";
import { Purorder } from "./purorder";

export class Grn{

  public id !: number;
  public date !: string;
  public description !: string;
  public grandtotal !: number;
  public employee !: Employee;
  public grnstatus !: Grnstatus;
  public purorder !: Purorder;
  public grnitems !: Array<Grnitem>;

  constructor(id: number, date: string, description: string, grandtotal: number, employee:Employee, grnstatus:Grnstatus, purorder:Purorder, grnitems: Array<Grnitem>) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.grandtotal = grandtotal;
    this.employee = employee;
    this.grnstatus = grnstatus;
    this.purorder = purorder;
    this.grnitems = grnitems;
  }

}





