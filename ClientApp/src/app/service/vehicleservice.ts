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

  // async delete(id: number): Promise<[]|undefined>{
  //   // @ts-ignore
  //   return this.http.delete('http://localhost:8080/employees/' + id).toPromise();
  // }

  // async update(employee: Employee): Promise<[]|undefined>{
  //   //console.log("Employee Updating-"+employee.id);
  //   return this.http.put<[]>('http://localhost:8080/employees', employee).toPromise();
  // }




  // async getAllListNameId(): Promise<Array<Employee>> {
  //
  //   const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
  //   if(employees == undefined){
  //     return [];
  //   }
  //   return employees;
  // }

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


