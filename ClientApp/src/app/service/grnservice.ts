import {Grn} from "../entity/grn";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";
import {Item} from "../entity/item";

@Injectable({
  providedIn: 'root'
})

export class GrnService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/grns/' + id).toPromise();
  }

  async update(grn: Grn): Promise<[]|undefined>{
    //console.log("Grn Updating-"+grn.id);
    return this.http.put<[]>('http://localhost:8080/grns', grn).toPromise();
  }


  async getAll(query:string): Promise<Array<Grn>> {
    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns'+query).toPromise();
    if(grns == undefined){
      return [];
    }
    return grns;
  }

  async getAllListNameId(): Promise<Array<Grn>> {

    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns/list').toPromise();
    if(grns == undefined){
      return [];
    }
    return grns;
  }

  async add(grn: Grn): Promise<[]|undefined>{
    //console.log("Grn Adding-"+JSON.stringify(grn));
    //grn.number="47457";
    return this.http.post<[]>('http://localhost:8080/grns', grn).toPromise();
  }

  async getGrntotal(id :number ): Promise<Array<Grn>> {

    const subcategoryes = await this.http.get<Array<Grn>>('http://localhost:8080/grns/total/'+id).toPromise();
    if(subcategoryes == undefined){
      return [];
    }
    return subcategoryes;
  }

}


