import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import { NumberService } from '../../../service/numberservice';
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import { Invoice } from 'src/app/entity/invoice';
import { InvoiceService } from 'src/app/service/invoiceservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
// @ts-ignore
import { Iteminvoice } from 'src/app/entity/iteminvoice';
import { Customer } from 'src/app/entity/customer';
import { Shop } from 'src/app/entity/shop';
import { Shopservice } from 'src/app/service/shopservice';
import { Customerservice } from 'src/app/service/customerservice';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent {



  columns: string[] = ['employee', 'invnumber', 'customer', 'date','grandtotal', 'shop'];
  headers: string[] = ['Employee', 'Number', 'Customer', 'Date', 'Grand Total','Shop'];
  binders: string[] = ['employee.fullname', 'invnumber', 'customer.phonenumber', 'date','grandtotal', 'shop.shopnumber'];

  cscolumns: string[] = ['csemployee', 'csinvnumber', 'cscustomer', 'csdate', 'csgrandtotal', 'csshop'];
  csprompts: string[] = ['Search by Employee', 'Search by Number', 'Search by Customer', 'Search by Date', 'Search by Grand Total', 'Search by Shop'];

  incolumns: string[] = ['item', 'qty', 'linetotal', 'remove'];
  inheaders: string[] = ['Item', 'QTY', 'Line Total','Remove',];
  inbinders: string[] = ['item.name', 'qty', 'linetotal','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Iteminvoice>
  innerform!:FormGroup;
  items:Array<Item> = [];
  iteminvoices:Array<Iteminvoice> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  invoice!: Invoice;
  oldinvoice!: Invoice;

  today = new Date();

  invoices: Array<Invoice> = [];
  data!: MatTableDataSource<Invoice>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  employees: Array<Employee> = [];
  customers: Array<Customer> = [];
  shops: Array<Shop> = [];

  enaadd:boolean = true;
  enadel:boolean = false;
  lastSequenceNumber: number = 0;

  constructor(
    private invs: InvoiceService,
    private itms: ItemService,
    private emps: EmployeeService,
    private shos: Shopservice,
    private cuss: Customerservice,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csemployee: new FormControl(),
      csinvnumber: new FormControl(),
      cscustomer: new FormControl(),
      csdate: new FormControl(),
      csgrandtotal: new FormControl(),
      csshop: new FormControl(),
    });

    this.ssearch = this.fb.group({
      sscustomer: new FormControl(),
      ssshop: new FormControl(),
    });

    this.form =this.fb.group({
      "date": new FormControl(this.today, [Validators.required],),
      "grandtotal": new FormControl('', [Validators.required]),
      "invnumber": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "shop": new FormControl('', [Validators.required]),
      "customer":new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

    this.innerform =this.fb.group({

      "qty": new FormControl('', [Validators.required]),
      "linetotal": new FormControl('', [Validators.required]),
      "item": new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.cuss.getAll('').then((vsts: Customer[]) => {
      this.customers = vsts;
    });

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.shos.getAll('').then((vbrs: Shop[]) => {
      this.shops = vbrs;
    });

    this.itms.getAll('').then((vbrs: Item[]) => {
      this.items = vbrs;
    });
  }

  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['shop'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['invnumber'];
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['customer'].setValidators([Validators.required]);

    this.innerform.controls['store'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);
    this.innerform.controls['unitcost'].setValidators([Validators.required]);
    this.innerform.controls['item'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldinvoice != undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
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

    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (this.oldinvoice != undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
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

    this.invs.getAll(query)
      .then((emps: Invoice[]) => {
        this.invoices = emps;
        //this.setLastSequenceNumberFromInvoice(this.invoices[this.invoices.length-1].invnumber);
        this.ns.setLastSequenceNumber(this.invoices[this.invoices.length-1].invnumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.invoices);
        this.data.paginator = this.paginator;
      });


  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (invoice: Invoice, filter: string) => {
      return (cserchdata.csdate == null || invoice.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csinvnumber == null || invoice.invnumber.toLowerCase().includes(cserchdata.csinvnumber.toLowerCase())) &&
        (cserchdata.csshop == null || invoice.shop.shopnumber.toLowerCase().includes(cserchdata.csshop.toLowerCase())) &&
        (cserchdata.csgrandtotal == null || invoice.grandtotal.toString().includes(cserchdata.csgrandtotal.toLowerCase())) &&
        (cserchdata.csemployee == null || invoice.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cscustomer == null || invoice.customer.phonenumber.toLowerCase().includes(cserchdata.cscustomer.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let custommerid = sserchdata.sscustomer;
    let shopid = sserchdata.ssshop;


    let query = "";

    if (custommerid != null) query = query + "&customerid=" + custommerid;
    if (shopid != null) query = query + "&shopid=" + shopid;


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

  fillForm(invoice: Invoice){

    this.enableButtons(false,true);

    this.selectedrow = invoice;

    this.invoice = JSON.parse(JSON.stringify(invoice));

    this.oldinvoice = JSON.parse(JSON.stringify(invoice));

    // @ts-ignore
    this.invoice.customer= this.customers.find(g => g.id === this.invoice.customer.id);
    // @ts-ignore
    this.invoice.employee = this.employees.find(e => e.id === this.invoice.employee.id);
    // @ts-ignore
    this.invoice.shop = this.shops.find(p => p.id === this.invoice.shop.id);


    this.indata = new MatTableDataSource(this.invoice.iteminvoices);

    this.form.patchValue(this.invoice);
    this.form.markAsPristine();
    this.calculateGrandTotal();

  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - invoice Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.invoice = this.form.getRawValue();
      this.invoice.iteminvoices = this.iteminvoices;

      // @ts-ignore
      this.iteminvoices.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.invoice.date;
      itmdata = itmdata + "<br>Phone Number is : " + this.invoice.customer.phonenumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - invoice Add",
          message: "Are you sure to Add the following invoice? <br> <br>" + itmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.grs.add(this.invoice).then((responce: [] | undefined) => {
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
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -invoice Add", message: addmessage}
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
        heading: "Confirmation - invoice Delete",
        message: "Are you sure to Delete following invoice? <br> <br>" + this.invoice.date+"id "+this.invoice.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.invs.delete(this.invoice.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - invoice Delete ", message: delmessage}
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
        heading: "Confirmation - invoice Clear",
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

  filteritem(){
    let purorder = this.form.controls['purorder'].value.id;
    this.itms.getItemByPurorder(purorder).then((msys: Item[]) => {
      this.items = msys;
    });
  }

//inner table

  id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();
    console.log(this.innerdata);

    if( this.innerdata != null){

      let linetotal = this.innerdata.qty * this.innerdata.item.sprice;

      let iteminvoice = new  Iteminvoice(this.id,this.innerdata.item,this.innerdata.qty,linetotal);

      let tem: Iteminvoice[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.iteminvoices = [];
      tem.forEach((t)=> this.iteminvoices.push(t));

      this.iteminvoices.push(iteminvoice);
      this.indata = new MatTableDataSource(this.iteminvoices);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){
    let grandtotal =0;
    this.indata.data.forEach((m)=>{
      grandtotal = grandtotal+m.linetotal
    })

    this.form.controls['grandtotal'].setValue(grandtotal);
  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.iteminvoices = this.indata.data;

    this.calculateGrandTotal();
  }


  generateNumber(): void {
    const newInvoiceNumber = this.ns.generateNumber('INV');
    this.form.controls['invnumber'].setValue(newInvoiceNumber);
  }

}










