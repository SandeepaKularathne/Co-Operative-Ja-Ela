import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Shopstatus } from "../entity/shopstatus";

@Injectable({
  providedIn: 'root'
})

export class Shopstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Shopstatus>> {

    const shopstatuses = await this.http.get<Array<Shopstatus>>('http://localhost:8080/shopstatuses/list').toPromise();
    if(shopstatuses == undefined){
      return [];
    }
    return shopstatuses;
  }

}


