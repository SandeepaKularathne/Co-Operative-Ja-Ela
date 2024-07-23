import { Injectable } from "@angular/core";
import { Disitem } from "./disitem";
import { Disstatus } from "./disstatus";
import { Employee } from "./employee";
import { Shop } from "./shop";


export class Disrequests{

  public id !: number;
  public disnumber !: number;
  public reqdate !: string;
  public description !: string;
  public grandtotal !: number;
  public employee !: Employee;
  public shop !: Shop;
  public disstatus !: Disstatus;
  public disitems !: Array<Disitem>;

  constructor(id: number, disnumber: number, reqdate: string, description: string, grandtotal: number, employee:Employee, shop:Shop, disstatus:Disstatus) {
    this.id = id;
    this.disnumber = disnumber;
    this.reqdate = reqdate;
    this.description = description;
    this.grandtotal = grandtotal;
    this.employee = employee;
    this.shop = shop;
    this.disstatus = disstatus;
  }


}





