import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehiclemodel} from "../entity/vehiclemodel";

@Injectable({
  providedIn: 'root'
})

export class Vehiclemodelservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Vehiclemodel>> {

    const vehiclemodels = await this.http.get<Array<Vehiclemodel>>('http://localhost:8080/vehiclemodels/list').toPromise();
    if(vehiclemodels == undefined){
      return [];
    }
    return vehiclemodels;
  }

}


