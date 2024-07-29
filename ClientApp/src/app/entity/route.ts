import {Grade} from "./grade";

export class Route{

  public id !: number;
  public name !: string;
  public distance !: string;
  public routenumber !: string;
  public grade !: Grade;

  constructor(id: number, name: string, distance: string, routenumber: string, grade: Grade) {
    this.id = id;
    this.name = name;
    this.distance = distance;
    this.routenumber = routenumber;
    this.grade = grade;
  }

}





