import {Disreceive} from "../entity/disreceive";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class Disreceiveservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/disreceives/' + id).toPromise();
  }

  async update(disreceive: Disreceive): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/disreceives', disreceive).toPromise();
  }


  async getAll(query:string): Promise<Array<Disreceive>> {
    const disreceives = await this.http.get<Array<Disreceive>>('http://localhost:8080/disreceives'+query).toPromise();
    if(disreceives == undefined){
      return [];
    }
    return disreceives;
  }


  async add(disreceive: Disreceive): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/disreceives', disreceive).toPromise();
  }

}


