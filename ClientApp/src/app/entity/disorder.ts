import { Employee } from "./employee";
import {Postatus} from "./postatus";
import {Vehicle} from "./vehicle";
import {Disrequests} from "./disrequests";
import {Disorderitem} from "./disorderitem";


export class Disorder{

  public id !: number;
  public disonumber !: string;
  public date !: string;
  public description !: string;
  public employee !: Employee;
  public postatus !: Postatus;
  public vehicle !: Vehicle;
  public disrequests !: Disrequests
  public disorderitems !: Array<Disorderitem >;

  constructor(id: number, disonumber: string, date: string, description: string, employee: Employee, postatus: Postatus, vehicle: Vehicle, disrequests: Disrequests, disorderitems: Array<Disorderitem>) {
    this.id = id;
    this.disonumber = disonumber;
    this.date = date;
    this.description = description;
    this.employee = employee;
    this.postatus = postatus;
    this.vehicle = vehicle;
    this.disrequests = disrequests;
    this.disorderitems = disorderitems;
  }


}





