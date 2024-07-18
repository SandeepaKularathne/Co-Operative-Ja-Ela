import { Employee } from "./employee";
import { Shopstatus } from "./shopstatus";

export class Shop{
  
  public id !: number;
  public shopnumber !: string;
  public address !: string;
  public cnumber !: string;
  public opdate !: string;
  public email !: string;
  public employee !: Employee;
  public shopstatus !: Shopstatus;

  constructor(id: number, shopnumber: string, address: string, cnumber: string, opdate: string, email: string, employee:Employee, shopstatus:Shopstatus) {
    this.id = id;
    this.shopnumber = shopnumber;
    this.address = address;
    this.cnumber = cnumber;
    this.opdate = opdate;
    this.email = email;
    this.employee = employee;
    this.shopstatus = shopstatus;
  }
}





