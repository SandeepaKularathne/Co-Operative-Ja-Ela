import {Shop} from "../entity/shop";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class Shopservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/shops/' + id).toPromise();
  }

  async update(shop: Shop): Promise<[]|undefined>{
    //console.log("Shop Updating-"+shop.id);
    return this.http.put<[]>('http://localhost:8080/shops', shop).toPromise();
  }


  async getAll(query:string): Promise<Array<Shop>> {
    const shops = await this.http.get<Array<Shop>>('http://localhost:8080/shops'+query).toPromise();
    if(shops == undefined){
      return [];
    }
    return shops;
  }


  async add(shop: Shop): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/shops', shop).toPromise();
  }

}


