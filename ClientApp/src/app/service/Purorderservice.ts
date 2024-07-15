import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Purorder} from "../entity/purorder";


@Injectable({
  providedIn: 'root'
})

export class PurorderService {


  constructor(private http: HttpClient) {  }

  async getAll(query:string): Promise<Array<Purorder>> {
    const purorders = await this.http.get<Array<Purorder>>('http://localhost:8080/purorders'+query).toPromise();
    if(purorders == undefined){
      return [];
    }
    return purorders;
  }

  async add(purorder: Purorder): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }

  async update(purorder: Purorder): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/purorders/' + id).toPromise();
  }
}


