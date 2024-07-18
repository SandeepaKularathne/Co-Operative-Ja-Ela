import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Loyaltyprogram} from "../entity/loyaltyprogram";

@Injectable({
  providedIn: 'root'
})

export class Loyaltyprogramservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Loyaltyprogram>> {

    const loyaltyprogrames = await this.http.get<Array<Loyaltyprogram>>('http://localhost:8080/loyaltyprograms/list').toPromise();
    if(loyaltyprogrames == undefined){
      return [];
    }
    return loyaltyprogrames;
  }

}


