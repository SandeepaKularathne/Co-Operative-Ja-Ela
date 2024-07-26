import {Supayment} from "../entity/supayment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class Supaymentservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/supayments/' + id).toPromise();
  }

  async update(supayment: Supayment): Promise<[]|undefined>{
    //console.log("Supayment Updating-"+supayment.id);
    return this.http.put<[]>('http://localhost:8080/supayments', supayment).toPromise();
  }


  async getAll(query:string): Promise<Array<Supayment>> {
    const supayments = await this.http.get<Array<Supayment>>('http://localhost:8080/supayments'+query).toPromise();
    if(supayments == undefined){
      return [];
    }
    return supayments;
  }


  async add(supayment: Supayment): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/supayments', supayment).toPromise();
  }

}


