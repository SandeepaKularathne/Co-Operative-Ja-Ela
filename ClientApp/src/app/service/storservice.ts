import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Store} from "../entity/store";


@Injectable({
  providedIn: 'root'
})

export class StoreService {
  

  constructor(private http: HttpClient) {  }

  async getAll(query:string): Promise<Array<Store>> {
    const stores = await this.http.get<Array<Store>>('http://localhost:8080/stores'+query).toPromise();
    if(stores == undefined){
      return [];
    }
    return stores;
  }

  async add(store: Store): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/stores', store).toPromise();
  }

  async update(store: Store): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/stores', store).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/stores/' + id).toPromise();
  }
}


