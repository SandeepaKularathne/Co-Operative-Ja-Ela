import {Deposits} from "../entity/deposits";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class Depositseservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/depositses/' + id).toPromise();
  }

  async update(deposits: Deposits): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/depositses', deposits).toPromise();
  }


  async getAll(query:string): Promise<Array<Deposits>> {
    const depositses = await this.http.get<Array<Deposits>>('http://localhost:8080/depositses'+query).toPromise();
    if(depositses == undefined){
      return [];
    }
    return depositses;
  }


  async add(deposits: Deposits): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/depositses', deposits).toPromise();
  }

}


