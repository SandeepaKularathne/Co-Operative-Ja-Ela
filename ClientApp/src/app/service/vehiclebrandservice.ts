import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehiclebrand} from "../entity/vehiclebrand";

@Injectable({
  providedIn: 'root'
})

export class Vehiclebrandservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Vehiclebrand>> {

    const vehiclebrands = await this.http.get<Array<Vehiclebrand>>('http://localhost:8080/vehiclebrands/list').toPromise();
    if(vehiclebrands == undefined){
      return [];
    }
    return vehiclebrands;
  }

}


