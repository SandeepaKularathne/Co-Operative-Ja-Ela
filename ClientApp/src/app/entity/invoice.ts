import { Customer } from "./customer";
import { Employee } from "./employee";
import { Iteminvoice } from "./iteminvoice";
import { Shop } from "./shop";

export class Invoice{

  public id !: number;
  public date !: string;
  public invnumber !: string;
  public grandtotal !: number;
  public employee !: Employee;
  public customer !: Customer;
  public shop !: Shop;
  public iteminvoices !: Array<Iteminvoice>;

  constructor(id: number, date: string,invnumber : string, grandtotal: number, employee:Employee, customer:Customer, shop:Shop, iteminvoices: Array<Iteminvoice>) {
    this.id = id;
    this.date = date;
    this.invnumber =invnumber;
    this.grandtotal = grandtotal;
    this.employee = employee;
    this.customer = customer;
    this.shop = shop;
    this.iteminvoices = iteminvoices;
  }

}





