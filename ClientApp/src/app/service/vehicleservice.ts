import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehicle} from "../entity/vehicle";


@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  

  constructor(private http: HttpClient) {  }

  async getAll(query:string): Promise<Array<Vehicle>> {
    const vehicles = await this.http.get<Array<Vehicle>>('http://localhost:8080/vehicles'+query).toPromise();
    if(vehicles == undefined){
      return [];
    }
    return vehicles;
  }

  async add(vehicle: Vehicle): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/vehicles', vehicle).toPromise();
  }

  async update(vehicle: Vehicle): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/vehicles', vehicle).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/vehicles/' + id).toPromise();
  }
}


