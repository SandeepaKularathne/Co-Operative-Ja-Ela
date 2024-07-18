import {Customer} from "../entity/customer";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Customerservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/customers/' + id).toPromise();
  }

  async update(customer: Customer): Promise<[]|undefined>{
    //console.log("Customer Updating-"+customer.id);
    return this.http.put<[]>('http://localhost:8080/customers', customer).toPromise();
  }


  async getAll(query:string): Promise<Array<Customer>> {
    const customers = await this.http.get<Array<Customer>>('http://localhost:8080/customers'+query).toPromise();
    if(customers == undefined){
      return [];
    }
    return customers;
  }


  async add(customer: Customer): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/customers', customer).toPromise();
  }

}


