import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subcategory} from "../entity/subcategory";

@Injectable({
  providedIn: 'root'
})

export class Subcategoryservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Subcategory>> {

    const subcategoryes = await this.http.get<Array<Subcategory>>('http://localhost:8080/subcategorys/list').toPromise();
    if(subcategoryes == undefined){
      return [];
    }
    return subcategoryes;
  }

  async getSubcategoryByCategory(id :number ): Promise<Array<Subcategory>> {

    const subcategoryes = await this.http.get<Array<Subcategory>>('http://localhost:8080/subcategorys/filter/'+id).toPromise();
    if(subcategoryes == undefined){
      return [];
    }
    return subcategoryes;
  }
}


