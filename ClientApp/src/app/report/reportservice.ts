import {CountByVehiclestatus} from "./entity/countbyvehiclestatus";
import {CountByCRDate} from "./entity/countbycrdate";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByIncomeShop} from "./entity/countbyincomeshop";

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

  async countByCRDate(query : string): Promise<Array<CountByCRDate>> {

    const countbycrdates = await this.http.get<Array<CountByCRDate>>('http://localhost:8080/reports/countbycrdate'+query).toPromise();
    if(countbycrdates == undefined){
      return [];
    }
    return countbycrdates;
  }

  async dashrep(): Promise<Array<any>> {

    const dashreps = await this.http.get<Array<any>>('http://localhost:8080/reports/dashrep').toPromise();
    if(dashreps == undefined){
      return [];
    }
    console.log(dashreps)
    return dashreps;

  }

  async countByIncomeShop(query : string): Promise<Array<CountByIncomeShop>> {

    const count = await this.http.get<Array<CountByIncomeShop>>('http://localhost:8080/reports/countbyshopincome'+query).toPromise();
    if(count == undefined){
      return [];
    }
    return count;
  }

  async valuation(): Promise<Array<any>> {

    const dashreps = await this.http.get<Array<any>>('http://localhost:8080/reports/valuation').toPromise();
    if(dashreps == undefined){
      return [];
    }
    console.log(dashreps)
    return dashreps;

  }

}


