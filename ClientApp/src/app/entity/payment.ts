import { Employee } from "./employee";
import { Invoice } from "./invoice";
import { Ptype } from "./ptype";

export class Payment {

  public id !: number;
  public pnumber !: string;
  public grandtotal !: number;
  public ptype !: Ptype;
  public invoice !: Invoice;
  public employee !: Employee;

  constructor(id: number, pnumber: string, grandtotal: number, ptype:Ptype, invoice:Invoice, employee:Employee) {
    this.id = id;
    this.pnumber = pnumber;
    this.grandtotal = grandtotal;
    this.ptype = ptype;
    this.invoice = invoice;
    this.employee = employee;
  }
  
}
