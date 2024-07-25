import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Ptype} from "../entity/ptype";

@Injectable({
  providedIn: 'root'
})

export class Ptypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Ptype>> {

    const polueestpes = await this.http.get<Array<Ptype>>('http://localhost:8080/ptypes/list').toPromise();
    if(polueestpes == undefined){
      return [];
    }
    return polueestpes;
  }

}


