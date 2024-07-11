import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehicletype} from "../entity/vehicletype";

@Injectable({
  providedIn: 'root'
})

export class Vehicletypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Vehicletype>> {

    const vehicletypes = await this.http.get<Array<Vehicletype>>('http://localhost:8080/vehicletypes/list').toPromise();
    if(vehicletypes == undefined){
      return [];
    }
    return vehicletypes;
  }

}


