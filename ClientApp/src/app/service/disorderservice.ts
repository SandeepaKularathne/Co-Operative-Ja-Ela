import {Disorder} from "../entity/disorder";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DisorderService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/disorders/' + id).toPromise();
  }

  async update(disorder: Disorder): Promise<[]|undefined>{
    //console.log("Disorder Updating-"+disorder.id);
    return this.http.put<[]>('http://localhost:8080/disorders', disorder).toPromise();
  }

  async getAll(query:string): Promise<Array<Disorder>> {
    const disorders = await this.http.get<Array<Disorder>>('http://localhost:8080/disorders'+query).toPromise();
    if(disorders == undefined){
      return [];
    }
    return disorders;
  }

  async add(disorder: Disorder): Promise<[]|undefined>{
    //console.log("Disorder Adding-"+JSON.stringify(disorder));
    //disorder.number="47457";
    return this.http.post<[]>('http://localhost:8080/disorders', disorder).toPromise();
  }

}


