import {Payment} from "../entity/payment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";

@Injectable({
  providedIn: 'root'
})

export class PaymentService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/payments/' + id).toPromise();
  }

  async getAll(query:string): Promise<Array<Payment>> {
    const payments = await this.http.get<Array<Payment>>('http://localhost:8080/payments'+query).toPromise();
    if(payments == undefined){
      return [];
    }
    return payments;
  }

  async add(payment: Payment): Promise<[]|undefined>{
    //console.log("Payment Adding-"+JSON.stringify(payment));
    //payment.number="47457";
    return this.http.post<[]>('http://localhost:8080/payments', payment).toPromise();
  }

}


