import {Supplierstatus} from "./supplierstatus";
import {Supplierstype} from "./supplierstype";
import {Userrole} from "./userrole";
import {Supply} from "./supply";


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
  public supplies!:Array<Supply>;

  // constructor(id: number, name: string, registernumber: string, doregister: string, address: string, officetp: string, email: string, contactperson: string, contactnumber: string, description: string, doenter: string, supplierstatus: Supplierstatus, supplierstype: Supplierstype, supplys: Array<Supply>) {
  //   this.id = id;
  //   this.name = name;
  //   this.registernumber = registernumber;
  //   this.doregister = doregister;
  //   this.address = address;
  //   this.officetp = officetp;
  //   this.email = email;
  //   this.contactperson = contactperson;
  //   this.contactnumber = contactnumber;
  //   this.description = description;
  //   this.doenter = doenter;
  //   this.supplierstatus = supplierstatus;
  //   this.supplierstype = supplierstype;
  //   this.supplys = supplys;
  // }

constructor() {
}
}
