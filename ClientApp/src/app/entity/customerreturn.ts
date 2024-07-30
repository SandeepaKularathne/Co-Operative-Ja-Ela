import { Employee } from "./employee";
import { Shopstatus } from "./shopstatus";
import {Route} from "./route";
import {Disorder} from "./disorder";
import {Store} from "./store";
import {Sritem} from "./sritem";
import {Disorderitem} from "./disorderitem";
import {Invoice} from "./invoice";
import {Critem} from "./critem";

export class Customerreturn{

  public id !: number;
  public date !: string;
  public grandtotal !: number;
  public employee !: Employee;
  public invoice !: Invoice;
  public critems !: Array<Critem>;

  constructor(id: number, date: string, grandtotal: number, employee: Employee, invoice: Invoice, critems: Array<Critem>) {
    this.id = id;
    this.date = date;
    this.grandtotal = grandtotal;
    this.employee = employee;
    this.invoice = invoice;
    this.critems = critems;
  }

}





