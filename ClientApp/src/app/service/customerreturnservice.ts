import {Customerreturn} from "../entity/customerreturn";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Invoice} from "../entity/invoice";

@Injectable({
  providedIn: 'root'
})

export class CustomerreturnService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/customerreturns/' + id).toPromise();
  }

  async update(customerreturn: Customerreturn): Promise<[]|undefined>{
    //console.log("Customerreturn Updating-"+customerreturn.id);
    return this.http.put<[]>('http://localhost:8080/customerreturns', customerreturn).toPromise();
  }


  async getAll(query:string): Promise<Array<Customerreturn>> {
    const customerreturns = await this.http.get<Array<Customerreturn>>('http://localhost:8080/customerreturns'+query).toPromise();
    if(customerreturns == undefined){
      return [];
    }
    return customerreturns;
  }

  async add(customerreturn: Customerreturn): Promise<[]|undefined>{
    //console.log("Customerreturn Adding-"+JSON.stringify(customerreturn));
    //customerreturn.number="47457";
    return this.http.post<[]>('http://localhost:8080/customerreturns', customerreturn).toPromise();
  }

  async getReqByshopr(id :number ): Promise<Array<Customerreturn>> {

    const subcategoryes = await this.http.get<Array<Customerreturn>>('http://localhost:8080/customerreturns/invre/'+id).toPromise();
    if(subcategoryes == undefined){
      return [];
    }
    return subcategoryes;
  }

}


