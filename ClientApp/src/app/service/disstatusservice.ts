import {Disstatus} from "../entity/disstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Disstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Disstatus>> {

    const disstatuss = await this.http.get<Array<Disstatus>>('http://localhost:8080/disstatuses/list').toPromise();
    if(disstatuss == undefined){
      return [];
    }
    return disstatuss;
  }

}


