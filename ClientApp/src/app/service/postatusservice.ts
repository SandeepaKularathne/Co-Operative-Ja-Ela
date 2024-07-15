import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Postatus } from 'src/app/entity/postatus';

@Injectable({
  providedIn: 'root'
})

export class Postatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Postatus>> {

    const postatusstatuses = await this.http.get<Array<Postatus>>('http://localhost:8080/postatuses/list').toPromise();
    if(postatusstatuses == undefined){
      return [];
    }
    return postatusstatuses;
  }

}


