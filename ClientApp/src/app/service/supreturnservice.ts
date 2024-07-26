import {Supreturn} from "../entity/supreturn";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class SupreturnService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/supreturns/' + id).toPromise();
  }

  async update(supreturn: Supreturn): Promise<[]|undefined>{
    //console.log("Supreturn Updating-"+supreturn.id);
    return this.http.put<[]>('http://localhost:8080/supreturns', supreturn).toPromise();
  }


  async getAll(query:string): Promise<Array<Supreturn>> {
    const supreturns = await this.http.get<Array<Supreturn>>('http://localhost:8080/supreturns'+query).toPromise();
    if(supreturns == undefined){
      return [];
    }
    return supreturns;
  }

  async getAllListNameId(): Promise<Array<Supreturn>> {

    const supreturns = await this.http.get<Array<Supreturn>>('http://localhost:8080/supreturns/list').toPromise();
    if(supreturns == undefined){
      return [];
    }
    return supreturns;
  }

  async add(supreturn: Supreturn): Promise<[]|undefined>{
    //console.log("Supreturn Adding-"+JSON.stringify(supreturn));
    //supreturn.number="47457";
    return this.http.post<[]>('http://localhost:8080/supreturns', supreturn).toPromise();
  }

}


