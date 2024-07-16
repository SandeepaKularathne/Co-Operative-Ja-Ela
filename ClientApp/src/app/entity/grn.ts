import { Employee } from "./employee";
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

  constructor(id: number, date: string, description: string, grandtotal: number, employee: Employee, grnstatus:Grnstatus, purorder:Purorder) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.grandtotal = grandtotal;
    this.employee = employee;
    this.grnstatus = grnstatus;
    this.purorder = purorder;
  }

}





