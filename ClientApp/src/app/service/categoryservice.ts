import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category} from "../entity/category";

@Injectable({
  providedIn: 'root'
})

export class Categoryservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Category>> {

    const categoryes = await this.http.get<Array<Category>>('http://localhost:8080/categorys/list').toPromise();
    if(categoryes == undefined){
      return [];
    }
    return categoryes;
  }

}


