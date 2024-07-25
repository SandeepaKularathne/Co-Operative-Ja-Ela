import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import { NumberService } from '../../../service/numberservice';
import {AuthorizationManager} from "../../../service/authorizationmanager";
import { Payment } from 'src/app/entity/payment';
import { PaymentService } from 'src/app/service/paymentservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Invoice } from 'src/app/entity/invoice';
import { Ptype } from 'src/app/entity/ptype';
import { Ptypeservice } from 'src/app/service/ptypeservice';
import { InvoiceService } from 'src/app/service/invoiceservice';
import { PrintService } from 'src/app/service/printservice';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent {


  columns: string[] = ['employee', 'pnumber', 'invoice', 'ptype'];
  headers: string[] = ['Employee', 'Number', 'Invoice', 'Payment Type'];
  binders: string[] = ['employee.fullname', 'pnumber', 'invoice.invnumber', 'ptype.name'];

  cscolumns: string[] = ['csemployee', 'cspnumber', 'cspayment', 'csptype'];
  csprompts: string[] = ['Search by Employee', 'Search by Number', 'Search by Payment', 'Search by Type'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  payment!: Payment;
  oldpayment!: Payment;

  today = new Date();

  payments: Array<Payment> = [];
  data!: MatTableDataSource<Payment>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  employees: Array<Employee> = [];
  invoices: Array<Invoice> = [];
  ptypes: Array<Ptype> = [];

  enaadd:boolean = true;
  enadel:boolean = false;
  lastSequenceNumber: number = 0;
  content:String = "";

  constructor(
    private pays: PaymentService,
    private ptys: Ptypeservice,
    private invs: InvoiceService,
    private emps: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private ns: NumberService,
    private ps: PrintService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csemployee: new FormControl(),
      cspnumber: new FormControl(),
      cspayment: new FormControl(),
      csptype: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssptype: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "pnumber": new FormControl(this.today, [Validators.required],),
      "grandtotal": new FormControl('', [Validators.required]),
      "invoice": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "ptype": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.invs.getAll('').then((vsts: Invoice[]) => {
      this.invoices = vsts;
    });

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.ptys.getAllList().then((vsts: Ptype[]) => {
      this.ptypes = vsts;
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['pnumber'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['invoice'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['ptype'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldpayment != undefined && control.valid) {
            // @ts-ignore
            if (value === this.payment[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }


    this.enableButtons(true,false);
  }

  enableButtons(add:boolean, del:boolean){
    this.enaadd=add;
    this.enadel=del;
  }

  loadTable(query: string) {

    this.pays.getAll(query)
      .then((emps: Payment[]) => {
        this.payments = emps;
        //this.setLastSequenceNumberFromPayment(this.payments[this.payments.length-1].invnumber);
        this.ns.setLastSequenceNumber(this.payments[this.payments.length-1].pnumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.payments);
        this.data.paginator = this.paginator;
      });


  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (payment: Payment, filter: string) => {
      // return (cserchdata.csdate == null || payment.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
      //   (cserchdata.csinvnumber == null || payment.invnumber.toLowerCase().includes(cserchdata.csinvnumber.toLowerCase())) &&
      //   (cserchdata.csshop == null || payment.shop.shopnumber.toLowerCase().includes(cserchdata.csshop.toLowerCase())) &&
      //   //(cserchdata.csgrandtotal == null || payment.grandtotal.includes(cserchdata.csgrandtotal.toLowerCase())) &&
      //   (cserchdata.csemployee == null || payment.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
      //   (cserchdata.cscustomer == null || payment.customer.phonenumber.toLowerCase().includes(cserchdata.cscustomer.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let ptypeid = sserchdata.ssptype;
    let employeeid = sserchdata.ssemployee;


    let query = "";

    if (ptypeid != null) query = query + "&ptypeid=" + ptypeid;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;


    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.csearch.reset();
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  fillForm(payment: Payment){

    this.enableButtons(false,true);

    this.selectedrow = payment;

    this.payment = JSON.parse(JSON.stringify(payment));

    this.oldpayment = JSON.parse(JSON.stringify(payment));

    // @ts-ignore
    this.payment.customer= this.customers.find(g => g.id === this.payment.customer.id);
    // @ts-ignore
    this.payment.employee = this.employees.find(e => e.id === this.payment.employee.id);
    // @ts-ignore
    this.payment.shop = this.shops.find(p => p.id === this.payment.shop.id);


    this.form.patchValue(this.payment);
    this.form.markAsPristine();

  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - payment Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.payment = this.form.getRawValue();

      let itmdata: string = "";

      itmdata = itmdata + "<br>Number is : " + this.payment.pnumber;
      itmdata = itmdata + "<br>Name is : " + this.payment.employee.fullname;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - payment Add",
          message: "Are you sure to Add the following payment? <br> <br>" + itmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.grs.add(this.payment).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              // @ts-ignore
              addstatus = responce['errors'] == "";
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              // @ts-ignore
              this.ps.print(this.content);
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -payment Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }

  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - payment Delete",
        message: "Are you sure to Delete following payment? <br> <br>" + this.payment.pnumber+"id "+this.payment.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.invs.delete(this.payment.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - payment Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - payment Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
        this.enableButtons(true,false);
        this.loadTable('');
        window.location.reload();
      }
    });

  }

  filtergrantotal(){
    let id = this.form.controls['invoice'].value.id;
    let selectedInvoice:any = this.invoices.find(invoice => invoice.id === id);

    this.form.controls['grandtotal'].setValue(selectedInvoice.grandtotal);
    console.log(selectedInvoice);
    // Generate the HTML for the item invoices
    let itemsHtml = '';

    // @ts-ignore
    selectedInvoice.iteminvoices.forEach(itemInvoice => {
      itemsHtml += `
        <tr>
          <td>${itemInvoice.item.name}</td>
          <td>${itemInvoice.qty}</td>
          <td>${itemInvoice.item.sprice}</td>
          <td>${itemInvoice.linetotal}</td>
        </tr>
      `;
    });

    // Generate the content for the payment slip
    this.content = `
      <h1>Payment Slip</h1>
      <p>Invoice Number: ${selectedInvoice.invnumber}</p>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p><strong>Grand Total: </strong>${selectedInvoice.grandtotal}</p>
    `;


  }

  generateNumber(): void {
    const newPaymentNumber = this.ns.generateNumber('PAY');
    this.form.controls['pnumber'].setValue(newPaymentNumber);
  }


}










