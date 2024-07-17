import { Employee } from "./employee";

export class Store{

  public id !: number;
  public storenumber !: string;
  public location !: string;
  public esdate !: string;
  public cnumber !: string;
  public email !: string;
  public employee !: Employee;

  constructor(id: number, storenumber: string, location: string, esdate: string, cnumber: string, email: string, employee:Employee) {
    this.id = id;
    this.storenumber = storenumber;
    this.location = location;
    this.esdate = esdate;
    this.cnumber = cnumber;
    this.email = email;
    this.employee = employee;
  }

}





