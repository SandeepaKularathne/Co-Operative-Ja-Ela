import { Employee } from "./employee";
import { Shopstatus } from "./shopstatus";
import {Route} from "./route";
import {Disorder} from "./disorder";

export class Disreceive{

  public id !: number;
  public disrecnumber !: string;
  public date !: string;
  public description !: string;
  public employee !: Employee;
  public disorder !: Disorder;

  constructor(id: number, disrecnumber: string, date: string, description: string, employee: Employee, disorder: Disorder) {
    this.id = id;
    this.disrecnumber = disrecnumber;
    this.date = date;
    this.description = description;
    this.employee = employee;
    this.disorder = disorder;
  }

}





