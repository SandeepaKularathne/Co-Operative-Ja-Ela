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
import { Storereturn } from 'src/app/entity/storereturn';
import { StorereturnService } from 'src/app/service/storereturnservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Sritem } from 'src/app/entity/sritem';
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
import { Store } from 'src/app/entity/store';
import { ChangeDetectorRef } from '@angular/core';
import {Postatus} from "../../../entity/postatus";
import {Disrequests} from "../../../entity/disrequests";
import { Storeservice } from 'src/app/service/storeservice';

@Component({
  selector: 'app-storereturn',
  templateUrl: './storereturn.component.html',
  styleUrls: ['./storereturn.component.css']
})

export class StorereturnComponent {


  columns: string[] = [ 'store', 'date','employee', 'description'];
  headers: string[] = [ 'Store', 'Date', 'Employee No','Description'];
  binders: string[] = [ 'store.storenumber', 'date','employee.number', 'description'];

  cscolumns: string[] = [ 'csstore', 'csdate', 'csemployee', 'csdescription'];
  csprompts: string[] = [ 'Search by Store', 'Search by Date', 'Search by Employee', 'Search by Description'];

  incolumns: string[] = ['item', 'qty', 'remove'];
  inheaders: string[] = ['Item', 'QTY','Remove',];
  inbinders: string[] = ['item.name', 'qty','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Sritem>;
  innerform!:FormGroup;
  items:Array<Item> = [];
  stores:Array<Store> = [];
  sritems:Array<Sritem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  storereturn!: Storereturn;
  oldstorereturn!: Storereturn;

  today = new Date();

  storereturns: Array<Storereturn> = [];
  data!: MatTableDataSource<Storereturn>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  innerregexes:any;
  selectedrow: any;

  employees: Array<Employee> = [];
  changedItems: Array<Sritem> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(
    private dios: StorereturnService,
    private itms: ItemService,
    private vehs: Storeservice,
    private emps: EmployeeService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager,) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csstore: new FormControl(),
      csdate: new FormControl(),
      csemployee: new FormControl(),
      csdescription: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssemployee: new FormControl(),
      ssstore: new FormControl(),
    });

    this.form =this.fb.group({
      "date": new FormControl(this.today, [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "store": new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

    this.innerform =this.fb.group({

      "qty": new FormControl('', [Validators.required]),
      "item": new FormControl('', [Validators.required]),

    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
    // let dateOnly = this.today.toISOString().split('T')[0];
    // console.log(dateOnly);
  }

  initialize() {

    this.createView();

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.vehs.getAll('').then((vbrs: Store[]) => {
      this.stores = vbrs;
    });

    this.itms.getAll('').then((vbrs: Item[]) => {
      this.items = vbrs;
    });

    this.rs.get('sritem').then((regs: []) => {
        this.regexes = regs;
        this.createForm();
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

    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['store'].setValidators([Validators.required]);

    this.innerform.controls['qty'].setValidators([Validators.required, Validators.pattern(this.regexes['qty']['regex'])]);
    this.innerform.controls['item'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "ssrqdate" || controlName == "ssrqdate")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldstorereturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.storereturn[controlName]) {
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
          if (this.oldstorereturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.storereturn[controlName]) {
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
      .then((emps: Storereturn[]) => {
        this.storereturns = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.storereturns);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (storereturn: Storereturn, filter: string) => {
      return (cserchdata.csdate == null || storereturn.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csdescription == null || storereturn.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csemployee == null || storereturn.employee.number.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csstore == null || storereturn.store.storenumber.toLowerCase().includes(cserchdata.csstore.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let employeeid = sserchdata.ssemployee;
    let storeid = sserchdata.ssstore;


    let query = "";

    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (storeid != null) query = query + "&storeid=" + storeid;


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

  fillForm(storereturn: Storereturn){

    this.enableButtons(false,true,true);

    this.selectedrow = storereturn;

    this.storereturn = JSON.parse(JSON.stringify(storereturn));

    this.oldstorereturn = JSON.parse(JSON.stringify(storereturn));

    // @ts-ignore
    this.storereturn.employee = this.employees.find(e => e.id === this.storereturn.employee.id);
    // @ts-ignore
    this.storereturn.store = this.stores.find(e => e.id === this.storereturn.store.id);

    this.indata = new MatTableDataSource(this.storereturn.sritems);

    this.indata.data.forEach(e => {
      console.log(e.item);
    });
    this.form.patchValue(this.storereturn);
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

      this.storereturn = this.form.getRawValue();
      this.storereturn.sritems = this.sritems;

      // @ts-ignore
      this.sritems.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.storereturn.date;
      itmdata = itmdata + "<br>Description is : " + this.storereturn.description;

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
          this.dios.add(this.storereturn).then((responce: [] | undefined) => {
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

            this.storereturn = this.form.getRawValue();
            this.storereturn.sritems = this.sritems;
            // @ts-ignore
            this.storereturn.id =this.oldstorereturn.id;

            // @ts-ignore
            this.sritems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.storereturn.date = this.dp.transform(this.storereturn.date,"yyyy-MM-dd");


            this.dios.update(this.storereturn).then((responce: [] | undefined) => {
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
        heading: "Confirmation - storereturn Delete",
        message: "Are you sure to Delete following storereturn? <br> <br>" + this.storereturn.date+"id "+this.storereturn.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dios.delete(this.storereturn.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - storereturn Delete ", message: delmessage}
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
        heading: "Confirmation - storereturn Clear",
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

      let sritem = new  Sritem(this.id,this.innerdata.item,this.innerdata.qty);

      let tem: Sritem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.sritems = [];
      tem.forEach((t)=> this.sritems.push(t));

      this.sritems.push(sritem);
      this.indata = new MatTableDataSource(this.sritems);

      this.id++;

      this.updateItem(sritem);

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
    this.sritems = this.indata.data;

  }

  updateItem(element: Sritem) {
    this.changedItems.push(element);
  }

}










