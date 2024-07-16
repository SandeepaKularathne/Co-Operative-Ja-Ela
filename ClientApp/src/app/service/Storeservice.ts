import {Store} from "../entity/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/stores/' + id).toPromise();
  }

  async update(store: Store): Promise<[]|undefined>{
    //console.log("Store Updating-"+store.id);
    return this.http.put<[]>('http://localhost:8080/stores', store).toPromise();
  }


  async getAll(query:string): Promise<Array<Store>> {
    const stores = await this.http.get<Array<Store>>('http://localhost:8080/stores'+query).toPromise();
    if(stores == undefined){
      return [];
    }
    return stores;
  }

  async getAllListNameId(): Promise<Array<Store>> {

    const stores = await this.http.get<Array<Store>>('http://localhost:8080/stores/list').toPromise();
    if(stores == undefined){
      return [];
    }
    return stores;
  }

  async add(store: Store): Promise<[]|undefined>{
    //console.log("Store Adding-"+JSON.stringify(store));
    //store.number="47457";
    return this.http.post<[]>('http://localhost:8080/stores', store).toPromise();
  }

}


