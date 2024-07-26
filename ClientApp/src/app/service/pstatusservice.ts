import {Pstatus} from "../entity/pstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Pstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Pstatus>> {

    const ployeestatuss = await this.http.get<Array<Pstatus>>('http://localhost:8080/pstatuses/list').toPromise();
    if(ployeestatuss == undefined){
      return [];
    }
    return ployeestatuss;
  }

}


