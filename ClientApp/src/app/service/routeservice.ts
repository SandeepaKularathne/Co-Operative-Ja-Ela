import {Route} from "../entity/route";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Routeservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/routes/' + id).toPromise();
  }

  async update(route: Route): Promise<[]|undefined>{
    //console.log("Route Updating-"+route.id);
    return this.http.put<[]>('http://localhost:8080/routes', route).toPromise();
  }


  async getAll(query:string): Promise<Array<Route>> {
    const routes = await this.http.get<Array<Route>>('http://localhost:8080/routes'+query).toPromise();
    if(routes == undefined){
      return [];
    }
    return routes;
  }


  async add(route: Route): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/routes', route).toPromise();
  }

}


