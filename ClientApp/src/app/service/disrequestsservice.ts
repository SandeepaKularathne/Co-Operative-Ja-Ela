import {Disrequests} from "../entity/disrequests";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DisrequestsService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/disrequestses/' + id).toPromise();
  }

  async update(disrequests: Disrequests): Promise<[]|undefined>{
    //console.log("Disrequests Updating-"+disrequests.id);
    return this.http.put<[]>('http://localhost:8080/disrequestses', disrequests).toPromise();
  }


  async getAll(query:string): Promise<Array<Disrequests>> {
    const disrequestss = await this.http.get<Array<Disrequests>>('http://localhost:8080/disrequestses'+query).toPromise();
    if(disrequestss == undefined){
      return [];
    }
    return disrequestss;
  }

  async getAllListNameId(): Promise<Array<Disrequests>> {

    const disrequestss = await this.http.get<Array<Disrequests>>('http://localhost:8080/disrequestses/list').toPromise();
    if(disrequestss == undefined){
      return [];
    }
    return disrequestss;
  }

  async add(disrequests: Disrequests): Promise<[]|undefined>{
    //console.log("Disrequests Adding-"+JSON.stringify(disrequests));
    //disrequests.number="47457";
    return this.http.post<[]>('http://localhost:8080/disrequestses', disrequests).toPromise();
  }

}


