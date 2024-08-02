import {CountByVehiclestatus} from "./entity/countbyvehiclestatus";
import {CountByCRDate} from "./entity/countbycrdate";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByIncomeShop} from "./entity/countbyincomeshop";
import {CountByShopstatus} from "./entity/countbyshopstatus";
import {Shipping} from "./entity/shipping";
import {CountByDisstatus} from "./entity/countbydisstatus";
import {CountByPostatus} from "./entity/countbypostatus";
import {CountByCategory} from "./entity/countbycategory";
import {Countbyitem} from "./entity/countbyitem";

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

  async countByShopstatus(): Promise<Array<CountByShopstatus>> {

    const countbyshopstatuss = await this.http.get<Array<CountByShopstatus>>('http://localhost:8080/reports/countbyshopstatus').toPromise();
    if(countbyshopstatuss == undefined){
      return [];
    }
    return countbyshopstatuss;
  }

  async shipping(query : string): Promise<Array<Shipping>>{

    const dashreps = await this.http.get<Array<any>>('http://localhost:8080/reports/shipping'+query).toPromise();
    if(dashreps == undefined){
      return [];
    }
    console.log(dashreps)
    return dashreps;

  }

  async countByDisstatus(): Promise<Array<CountByDisstatus>> {

    const countbyshopstatuss = await this.http.get<Array<CountByDisstatus>>('http://localhost:8080/reports/countbydisstatus').toPromise();
    if(countbyshopstatuss == undefined){
      return [];
    }
    return countbyshopstatuss;
  }

  async countByPostatus(): Promise<Array<CountByPostatus>> {

    const countbyshopstatuss = await this.http.get<Array<CountByPostatus>>('http://localhost:8080/reports/countbypostatus').toPromise();
    if(countbyshopstatuss == undefined){
      return [];
    }
    return countbyshopstatuss;
  }

  async countByCategory(): Promise<Array<CountByCategory>> {

    const countbyshopstatuss = await this.http.get<Array<CountByCategory>>('http://localhost:8080/reports/countbycategory').toPromise();
    if(countbyshopstatuss == undefined){
      return [];
    }
    return countbyshopstatuss;
  }

  async countbyitem(query : string): Promise<Array<Countbyitem>>{

    const dashreps = await this.http.get<Array<Countbyitem>>('http://localhost:8080/reports/countbyitem'+query).toPromise();
    if(dashreps == undefined){
      return [];
    }
    console.log(dashreps)
    return dashreps;

  }

}


