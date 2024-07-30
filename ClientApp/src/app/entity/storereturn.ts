import { Employee } from "./employee";
import { Shopstatus } from "./shopstatus";
import {Route} from "./route";
import {Disorder} from "./disorder";
import {Store} from "./store";
import {Sritem} from "./sritem";
import {Disorderitem} from "./disorderitem";

export class Storereturn{

  public id !: number;
  public date !: string;
  public description !: string;
  public employee !: Employee;
  public store !: Store;
  public sritems !: Array<Sritem >;

  constructor(id: number, date: string, description: string, employee: Employee, store: Store, sritems: Array<Sritem>) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.employee = employee;
    this.store = store;
    this.sritems = sritems;
  }

}





