import { Employee } from "./employee";
import { Grn } from "./grn";
import { Pstatus } from "./pstatus";
import { Ptype } from "./ptype";
import { Supplier } from "./supplier";

export class Supayment{

  public id !: number;
  public ssuppayno !: string;
  public grandtotal !: string;
  public supplier !: Supplier;
  public grn !: Grn;
  public ptype !: Ptype;
  public employee !: Employee;
  public pstatus !: Pstatus;

  constructor(id: number, ssuppayno: string, grandtotal: string, supplier:Supplier, grn:Grn, ptype:Ptype, employee:Employee, pstatus:Pstatus) {
    this.id = id;
    this.ssuppayno = ssuppayno;
    this.grandtotal = grandtotal;
    this.supplier = supplier;
    this.grn = grn;
    this.ptype = ptype;
    this.employee = employee;
    this.pstatus = pstatus;
  }
}





