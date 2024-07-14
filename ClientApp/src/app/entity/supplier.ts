import {Supplierstatus} from "./supplierstatus";
import {Supplierstype} from "./supplierstype";


export class Supplier {

  public id !: number;
  public name !: string;
  public registernumber !: string;
  public doregister !: string;
  public address !: string;
  public officetp !: string;
  public email !: string;
  public contactperson !: string;
  public contactnumber !: string;
  public description !: string;
  public doenter !: string;
  public supplierstatus !: Supplierstatus;
  public supplierstype !: Supplierstype;


  constructor(id: number, name: string, registernumber: string, doregister: string, address: string, description: string,
              officetp: string, email: string, contactperson: string, contactnumber: string,
              doenter: string, supplierstatus: Supplierstatus, supplierstype: Supplierstype) {
    this.id = id;
    this.name = name;
    this.registernumber = registernumber;
    this.doregister = doregister;
    this.address = address;
    this.description = description;
    this.officetp = officetp;
    this.email = email
    this.contactperson = contactperson;
    this.contactnumber = contactnumber;
    this.doenter = doenter;
    this.supplierstatus = supplierstatus;
    this.supplierstype = supplierstype;
  }

}
