import {Invoice} from "../entity/invoice";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";
import {Item} from "../entity/item";

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/invoices/' + id).toPromise();
  }

  async getAll(query:string): Promise<Array<Invoice>> {
    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices'+query).toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }

  async add(invoice: Invoice): Promise<[]|undefined>{
    //console.log("Invoice Adding-"+JSON.stringify(invoice));
    //invoice.number="47457";
    return this.http.post<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }

  async getGtotal(id: number): Promise<number> {
    const val = await this.http.get<number>(`http://localhost:8080/invoices/val/${id}`).toPromise();
    return val ?? 0;
  }

}


