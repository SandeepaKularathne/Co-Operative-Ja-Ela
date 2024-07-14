import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehiclestatus} from "../entity/vehiclestatus";

@Injectable({
  providedIn: 'root'
})

export class Supplierstypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Vehiclestatus>> {

    const vehiclestatuses = await this.http.get<Array<Vehiclestatus>>('http://localhost:8080/supplierstypes/list').toPromise();
    if(vehiclestatuses == undefined){
      return [];
    }
    return vehiclestatuses;
  }

}


