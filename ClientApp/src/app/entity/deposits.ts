import { Employee } from "./employee";
import { Shopstatus } from "./shopstatus";
import {Route} from "./route";
import {Disorder} from "./disorder";
import {Shop} from "./shop";

export class Deposits{

  public id !: number;
  public date !: string;
  public description !: string;
  public totaldeposit !: number;
  public employee !: Employee;
  public shop !: Shop;

  constructor(id: number, date: string, description: string, totaldeposit: number, employee: Employee, shop: Shop) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.totaldeposit = totaldeposit;
    this.employee = employee;
    this.shop = shop;
  }
}





