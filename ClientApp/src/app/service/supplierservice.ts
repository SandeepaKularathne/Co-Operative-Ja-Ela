import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Vehicle} from "../entity/vehicle";
import { Supplier } from "../entity/supplier";
import {Item} from "../entity/item";


@Injectable({
  providedIn: 'root'
})

export class SupplierService {

  constructor(private http: HttpClient) {  }

  async getAll(query:string): Promise<Array<Supplier>> {
    const suppliers = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers'+query).toPromise();
    if(suppliers == undefined){
      return [];
    }
    return suppliers;
  }

  async add(vehicle: Vehicle): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/suppliers', vehicle).toPromise();
  }

  async update(vehicle: Vehicle): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/suppliers', vehicle).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/suppliers/' + id).toPromise();
  }

  async getSupplierByGrn(id :number ): Promise<Array<Supplier>> {

    const subcategoryes = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers/grn/'+id).toPromise();
    if(subcategoryes == undefined){
      return [];
    }
    return subcategoryes;
  }
}


