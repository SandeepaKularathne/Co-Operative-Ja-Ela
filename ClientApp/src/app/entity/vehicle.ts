import {Vehiclestatus} from "./vehiclestatus";
import {Vehicletype} from "./vehicletype";
import {Vehiclemodel} from "./vehiclemodel";
import { Vehiclebrand } from "./vehiclebrand";

export class Vehicle {

  public id !: number;
  public number !: string;
  public doattach !: string;
  public yom !: number;
  public capacity !: number;
  public description !: string;
  public poto !: string;
  public curentmeterreading !: number;
  public lastregdate !: string;
  public lastservicedate !: string;
  public vehiclestatus !: Vehiclestatus;
  public vehicletype !: Vehicletype;
  public vehiclemodel !: Vehiclemodel;
  public vehiclebrand !: Vehiclebrand;


  constructor(id: number, number: string, doattach: string, yom: number, capacity: number, description: string,
              poto: string, curentmeterreading: number, lastregdate: string, lastservicedate: string,
              vehiclestatus: Vehiclestatus, vehicletype: Vehicletype, vehiclemodel: Vehiclemodel, vehiclebrand: Vehiclebrand) {
    this.id = id;
    this.number = number;
    this.doattach = doattach;
    this.yom = yom;
    this.capacity = capacity;
    this.description = description;
    this.poto = poto;
    this.curentmeterreading = curentmeterreading;
    this.lastregdate = lastregdate;
    this.lastservicedate = lastservicedate;
    this.vehiclestatus = vehiclestatus;
    this.vehicletype = vehicletype;
    this.vehiclemodel = vehiclemodel;
    this.vehiclebrand = vehiclebrand;
  }

}
