import {Storereturn} from "../entity/storereturn";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class StorereturnService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/storereturns/' + id).toPromise();
  }

  async update(storereturn: Storereturn): Promise<[]|undefined>{
    //console.log("Storereturn Updating-"+storereturn.id);
    return this.http.put<[]>('http://localhost:8080/storereturns', storereturn).toPromise();
  }


  async getAll(query:string): Promise<Array<Storereturn>> {
    const storereturns = await this.http.get<Array<Storereturn>>('http://localhost:8080/storereturns'+query).toPromise();
    if(storereturns == undefined){
      return [];
    }
    return storereturns;
  }

  async add(storereturn: Storereturn): Promise<[]|undefined>{
    //console.log("Storereturn Adding-"+JSON.stringify(storereturn));
    //storereturn.number="47457";
    return this.http.post<[]>('http://localhost:8080/storereturns', storereturn).toPromise();
  }

}


