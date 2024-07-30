import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import { Customerreturn } from 'src/app/entity/customerreturn';
import { CustomerreturnService } from 'src/app/service/customerreturnservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Critem } from 'src/app/entity/critem';
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
import { ChangeDetectorRef } from '@angular/core';
import {Postatus} from "../../../entity/postatus";
import {Disrequests} from "../../../entity/disrequests";
import {Invoice} from "../../../entity/invoice";
import {InvoiceService} from "../../../service/invoiceservice";




@Component({
  selector: 'app-customerreturn',
  templateUrl: './customerreturn.component.html',
  styleUrls: ['./customerreturn.component.css']
})

export class CustomerreturnComponent {


  columns: string[] = [ 'invoice', 'date','employee', 'grandtotal'];
  headers: string[] = [ 'Invoice', 'Date', 'Employee No','Grandtotal'];
  binders: string[] = [ 'invoice.invnumber', 'date','employee.number', 'grandtotal'];

  cscolumns: string[] = [ 'csinvoice', 'csdate', 'csemployee', 'csgrandtotal'];
  csprompts: string[] = [ 'Search by Invoice', 'Search by Date', 'Search by Employee', 'Search by Grandtotal'];

  incolumns: string[] = ['item', 'qty', 'remove'];
  inheaders: string[] = ['Item', 'QTY','Remove',];
  inbinders: string[] = ['item.name', 'qty','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Critem>;
  innerform!:FormGroup;
  items:Array<Item> = [];
  invoices:Array<Invoice> = [];
  critems:Array<Critem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  customerreturn!: Customerreturn;
  oldcustomerreturn!: Customerreturn;

  today = new Date();

  customerreturns: Array<Customerreturn> = [];
  data!: MatTableDataSource<Customerreturn>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  innerregexes:any;
  selectedrow: any;

  employees: Array<Employee> = [];
  disrequestses: Array<Disrequests> = [];
  postatuses: Array<Postatus> = [];
  changedItems: Array<Critem> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(
    private dios: CustomerreturnService,
    private itms: ItemService,
    private vehs: InvoiceService,
    private emps: EmployeeService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager,
    private cdr: ChangeDetectorRef) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csinvoice: new FormControl(),
      csdate: new FormControl(),
      csemployee: new FormControl(),
      csgrandtotal: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssinvoice: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "date": new FormControl(this.today, [Validators.required]),
      "grandtotal": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "invoice": new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

    this.innerform =this.fb.group({

      "qty": new FormControl('', [Validators.required]),
      "item": new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.vehs.getAll('').then((vbrs: Invoice[]) => {
      this.invoices = vbrs;
    });

    this.itms.getAll('').then((vbrs: Item[]) => {
      this.items = vbrs;
    });

    this.rs.get('customerreturn').then((regs: []) => {
      this.regexes = regs;
      this.rs.get('critem').then((regs: []) => {
        this.innerregexes = regs;
        this.createForm();
      })
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

    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['invoice'].setValidators([Validators.required]);

    this.innerform.controls['qty'].setValidators([Validators.required, Validators.pattern(this.innerregexes['qty']['regex'])]);
    this.innerform.controls['item'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "ssrqdate" || controlName == "ssrqdate")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldcustomerreturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.customerreturn[controlName]) {
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
          if (this.oldcustomerreturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.customerreturn[controlName]) {
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

    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  loadTable(query: string) {

    this.dios.getAll(query)
      .then((emps: Customerreturn[]) => {
        this.customerreturns = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.customerreturns);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (customerreturn: Customerreturn, filter: string) => {
      return (cserchdata.csdate == null || customerreturn.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csgrandtotal == null || customerreturn.grandtotal.toString().toLowerCase().includes(cserchdata.csgrandtotal.toLowerCase())) &&
        (cserchdata.csemployee == null || customerreturn.employee.number.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csinvoice == null || customerreturn.invoice.invnumber.toLowerCase().includes(cserchdata.csstore.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let invoiceid = sserchdata.ssinvoice;
    let employeeid = sserchdata.ssemployee;


    let query = "";

    if (invoiceid != null) query = query + "&invoiceid=" + invoiceid;
    if (employeeid != null) query = query + "&postatusid=" + employeeid;


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

  fillForm(customerreturn: Customerreturn){

    this.enableButtons(false,true,true);

    this.selectedrow = customerreturn;

    this.customerreturn = JSON.parse(JSON.stringify(customerreturn));

    this.oldcustomerreturn = JSON.parse(JSON.stringify(customerreturn));

    // @ts-ignore
    this.customerreturn.employee = this.employees.find(e => e.id === this.customerreturn.employee.id);
    // @ts-ignore
    this.customerreturn.invoice = this.invoices.find(e => e.id === this.customerreturn.invoice.id);



    this.indata = new MatTableDataSource(this.customerreturn.critems);

    this.indata.data.forEach(e => {
      console.log(e.item);
    });
    this.form.patchValue(this.customerreturn);
    this.form.markAsPristine();

  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - grn Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.customerreturn = this.form.getRawValue();
      this.customerreturn.critems = this.critems;

      // @ts-ignore
      this.critems.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.customerreturn.date;
      itmdata = itmdata + "<br>Grandtotal is : " + this.customerreturn.grandtotal;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - grn Add",
          message: "Are you sure to Add the following grn? <br> <br>" + itmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.dios.add(this.customerreturn).then((responce: [] | undefined) => {
            if (responce != undefined) {
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
              data: {heading: "Status -grn Add", message: addmessage}
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

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - supreturn Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Dis Requests Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.customerreturn = this.form.getRawValue();
            this.customerreturn.critems = this.critems;
            // @ts-ignore
            this.customerreturn.id =this.oldcustomerreturn.id;

            // @ts-ignore
            this.critems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.customerreturn.date = this.dp.transform(this.customerreturn.date,"yyyy-MM-dd");


            this.dios.update(this.customerreturn).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -supreturn Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - supreturn Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }

    if (this.changedItems.length > 0) {
      updates += "<br>Dis Items Changed";
    }

    return updates;
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - customerreturn Delete",
        message: "Are you sure to Delete following customerreturn? <br> <br>" + this.customerreturn.date+"id "+this.customerreturn.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dios.delete(this.customerreturn.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - customerreturn Delete ", message: delmessage}
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
        heading: "Confirmation - customerreturn Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
        this.enableButtons(true,false,false);
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

      let linecost = this.innerdata.qty * this.innerdata.unitcost;

      let critem = new  Critem(this.id,this.innerdata.item,this.innerdata.qty);

      let tem: Critem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.critems = [];
      tem.forEach((t)=> this.critems.push(t));

      this.critems.push(critem);
      this.indata = new MatTableDataSource(this.critems);

      this.id++;

      this.updateItem(critem);

      this.innerform.reset();

    }

  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }

    this.updateItem(x);

    this.indata.data = datasources;
    this.critems = this.indata.data;

  }

  updateItem(element: Critem) {
    this.changedItems.push(element);
  }

}










