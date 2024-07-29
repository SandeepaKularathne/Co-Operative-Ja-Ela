import {Grade} from "../entity/grade";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class GradeService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Grade>> {

    const grades = await this.http.get<Array<Grade>>('http://localhost:8080/grades/list').toPromise();
    if(grades == undefined){
      return [];
    }
    return grades;
  }

}


