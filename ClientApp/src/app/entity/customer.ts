import { Gender } from "./gender";
import { Loyaltyprogram } from "./loyaltyprogram";

export class Customer {

  public id !: number;
  public name !: string;
  public birthday !: string;
  public date !: string;
  public email !: string;
  public phonenumber !: string;
  public city !: string;
  public gender !: Gender;
  public loyaltyprogram !: Loyaltyprogram;

  constructor(id: number, name: string, birthday: string, date: string, email: string, phonenumber: string, city: string, gender:Gender, loyaltyprogram:Loyaltyprogram) {
    this.id = id;
    this.name = name;
    this.birthday = birthday;
    this.date = date;
    this.email = email;
    this.phonenumber = phonenumber;
    this.city = city;
    this.gender = gender;
    this.loyaltyprogram = loyaltyprogram;
  }
}
