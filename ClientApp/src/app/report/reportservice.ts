import {CountByVehiclestatus} from "./entity/countbyvehiclestatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByVehiclestatus(): Promise<Array<CountByVehiclestatus>> {

    const countbyvehiclestatuss = await this.http.get<Array<CountByVehiclestatus>>('http://localhost:8080/reports/countbyvehiclestatus').toPromise();
    if(countbyvehiclestatuss == undefined){
      return [];
    }
    return countbyvehiclestatuss;
  }

}


