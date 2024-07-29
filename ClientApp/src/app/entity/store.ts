import { Employee } from "./employee";
import {Route} from "./route";

export class Store{

  public id !: number;
  public storenumber !: string;
  public location !: string;
  public esdate !: string;
  public cnumber !: string;
  public email !: string;
  public employee !: Employee;
  public route !: Route;

  constructor(id: number, storenumber: string, location: string, esdate: string, cnumber: string, email: string, employee:Employee,route:Route) {
    this.id = id;
    this.storenumber = storenumber;
    this.location = location;
    this.esdate = esdate;
    this.cnumber = cnumber;
    this.email = email;
    this.employee = employee;
    this.route = route;
  }

}





