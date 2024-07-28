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
import { Supreturn } from 'src/app/entity/supreturn';
import { SupreturnService } from 'src/app/service/supreturnservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Supreitem } from 'src/app/entity/supreitem';
import { Item } from 'src/app/entity/item';
import { Store } from 'src/app/entity/store';
import { ItemService } from 'src/app/service/itemservice';
import { NumberService } from 'src/app/service/numberservice';
import { Grn } from 'src/app/entity/grn';
import { Supplier } from 'src/app/entity/supplier';
import { SupplierService } from 'src/app/service/supplierservice';
import { GrnService } from 'src/app/service/grnservice';


@Component({
  selector: 'app-supreturn',
  templateUrl: './supreturn.component.html',
  styleUrls: ['./supreturn.component.css']
})

export class SupreturnComponent {

  changedItems: Array<Supreitem> = [];

  columns: string[] = ['supplier', 'registernumber', 'grandtotal', 'date','grn','employee'];
  headers: string[] = ['Supplier', 'Register Number', 'Grand total', 'Date', 'GRN','Employee'];
  binders: string[] = ['supplier.name', 'supplier.registernumber', 'grandtotal', 'date','grn.grnnumber','employee.fullname'];

  cscolumns: string[] = ['cssupplier', 'csregisternumber', 'csgrandtotal', 'csdate', 'csgrn','csemployee'];
  csprompts: string[] = ['Search by Supplier', 'Search by Reg Number', 'Search by Grand Total', 'Search by Date', 'Search by GRN','Search by Employee'];

  incolumns: string[] = ['item', 'qty', 'remove'];
  inheaders: string[] = ['Item', 'QTY','Remove',];
  inbinders: string[] = ['item.name', 'qty','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Supreitem>
  innerform!:FormGroup;
  items:Array<Item> = [];
  stores:Array<Store> = [];
  supreitems:Array<Supreitem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  supreturn!: Supreturn;
  oldsupreturn!: Supreturn;

  today = new Date();

  supreturns: Array<Supreturn> = [];
  data!: MatTableDataSource<Supreturn>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  grns: Array<Grn> = [];
  suppliers: Array<Supplier> = [];
  employees: Array<Employee> = [];

  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private surs: SupreturnService,
    private itms: ItemService,
    private sups: SupplierService,
    private emps: EmployeeService,
    private grs: GrnService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      cssupplier: new FormControl(),
      csregisternumber: new FormControl(),
      csgrandtotal: new FormControl(),
      csdate: new FormControl(),
      csgrn: new FormControl(),
      csemployee: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssgrn: new FormControl(),
      sssupplier: new FormControl(),
    });

    this.form =this.fb.group({
      "returnno": new FormControl([Validators.required],),
      "date": new FormControl(this.today, [Validators.required],),
      "reason": new FormControl('', [Validators.required]),
      "grandtotal": new FormControl('', [Validators.required]),
      "grn": new FormControl('', [Validators.required]),
      "supplier": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),

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

    this.grs.getAll('').then((vsts: Grn[]) => {
      this.grns = vsts;
    });

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.sups.getAll('').then((vbrs: Supplier[]) => {
      this.suppliers = vbrs;
    });

    this.itms.getAll('').then((vbrs: Item[]) => {
      this.items = vbrs;
    });

    this.rs.get('supreturn').then((regs: []) => {
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

    this.form.controls['returnno'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['reason'].setValidators([Validators.required, Validators.pattern(this.regexes['reason']['regex'])]);
    this.form.controls['grandtotal'].setValidators([Validators.required, Validators.pattern(this.regexes['grandtotal']['regex'])]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['grn'].setValidators([Validators.required]);
    this.form.controls['supplier'].setValidators([Validators.required]);

    this.innerform.controls['qty'].setValidators([Validators.required]);
    this.innerform.controls['item'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldsupreturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supreturn[controlName]) {
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
          if (this.oldsupreturn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supreturn[controlName]) {
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

    this.surs.getAll(query)
      .then((emps: Supreturn[]) => {
        this.supreturns = emps;
        this.ns.setLastSequenceNumber(this.supreturns[this.supreturns.length-1].returnno);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.supreturns);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (supreturn: Supreturn, filter: string) => {
      return (cserchdata.csdate == null || supreturn.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csregisternumber == null || supreturn.supplier.registernumber.toLowerCase().includes(cserchdata.csregisternumber.toLowerCase())) &&
        (cserchdata.cssupplier == null || supreturn.supplier.name.toLowerCase().includes(cserchdata.cssupplier.toLowerCase())) &&
        (cserchdata.csgrandtotal == null || supreturn.grandtotal.toString().includes(cserchdata.csgrandtotal.toLowerCase())) &&
        (cserchdata.csemployee == null || supreturn.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csgrn == null || supreturn.grn.grnnumber.toLowerCase().includes(cserchdata.csgrn.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let grnid = sserchdata.ssgrn;
    let supplierid = sserchdata.sssupplier;


    let query = "";

    if (supplierid != null) query = query + "&supplierid=" + supplierid;
    if (grnid != null) query = query + "&grnid=" + grnid;


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

  fillForm(supreturn: Supreturn){

    this.enableButtons(false,true,true);

    this.selectedrow = supreturn;

    this.supreturn = JSON.parse(JSON.stringify(supreturn));

    this.oldsupreturn = JSON.parse(JSON.stringify(supreturn));

    // @ts-ignore
    this.supreturn.supplier = this.suppliers.find(g => g.id === this.supreturn.supplier.id);
    // @ts-ignore
    this.supreturn.employee = this.employees.find(e => e.id === this.supreturn.employee.id);
    // @ts-ignore
    this.supreturn.grn = this.grns.find(p => p.id === this.supreturn.grn.id);


    this.indata = new MatTableDataSource(this.supreturn.supreitems);

    this.form.patchValue(this.supreturn);
    this.form.markAsPristine();
    this.calculateGrandTotal();

  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - supreturn Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.supreturn = this.form.getRawValue();
      this.supreturn.supreitems = this.supreitems;

      // @ts-ignore
      this.supreitems.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.supreturn.date;
      itmdata = itmdata + "<br>Description is : " + this.supreturn.reason;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - supreturn Add",
          message: "Are you sure to Add the following supreturn? <br> <br>" + itmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.surs.add(this.supreturn).then((responce: [] | undefined) => {
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
              data: {heading: "Status -supreturn Add", message: addmessage}
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
            heading: "Confirmation - supreturn Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.supreturn = this.form.getRawValue();
            this.supreturn.supreitems = this.supreitems;
            // @ts-ignore
            this.supreturn.id =this.oldsupreturn.id;

            // @ts-ignore
            this.supreitems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.supreturn.date = this.dp.transform(this.supreturn.date,"yyyy-MM-dd");


            this.surs.update(this.supreturn).then((responce: [] | undefined) => {
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
      updates += "<br>Sup Items Changed";
    }
    return updates;
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - supreturn Delete",
        message: "Are you sure to Delete following supreturn? <br> <br>" + this.supreturn.date+"id "+this.supreturn.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.surs.delete(this.supreturn.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - supreturn Delete ", message: delmessage}
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
        heading: "Confirmation - supreturn Clear",
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
    let e = this.form.controls['grn'].value.id;
    this.itms.getItemByGrn(e).then((msys: Item[]) => {
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

      let supreitem = new  Supreitem(this.id,this.innerdata.item,this.innerdata.qty);

      let tem: Supreitem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.supreitems = [];
      tem.forEach((t)=> this.supreitems.push(t));

      this.supreitems.push(supreitem);
      this.indata = new MatTableDataSource(this.supreitems);

      this.id++;
      this.updateItem(supreitem);

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){
    let grandtotal =0;
    //console.log(this.indata.data.forEach(e=>e.item.pprice));
    this.indata.data.forEach(e=>{

      grandtotal = grandtotal+ e.item.pprice*e.qty;
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
    this.supreitems = this.indata.data;

    this.updateItem(x);

    this.calculateGrandTotal();
  }

  generateNumber(): void {
    const newNumber = this.ns.generateNumber('RET');
    this.form.controls['returnno'].setValue(newNumber);
  }

  updateItem(element: Supreitem) {
    this.changedItems.push(element);
  }
}










