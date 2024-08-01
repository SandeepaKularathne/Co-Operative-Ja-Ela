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
import { Disorder } from 'src/app/entity/disorder';
import { DisorderService } from 'src/app/service/disorderservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Disorderitem } from 'src/app/entity/disorderitem';
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
import { Vehicle } from 'src/app/entity/vehicle';
import { VehicleService } from 'src/app/service/vehicleservice';
import { NumberService } from 'src/app/service/numberservice';
import { ChangeDetectorRef } from '@angular/core';
import {Postatus} from "../../../entity/postatus";
import {Disrequests} from "../../../entity/disrequests";
import {Postatusservice} from "../../../service/postatusservice";
import {DisrequestsService} from "../../../service/disrequestsservice";


@Component({
  selector: 'app-disorder',
  templateUrl: './disorder.component.html',
  styleUrls: ['./disorder.component.css']
})

export class DisorderComponent {


  columns: string[] = ['disonumber', 'vehicle', 'date','employee', 'description'];
  headers: string[] = ['Number', 'Vehicle', 'Date', 'Employee No','Description'];
  binders: string[] = ['disonumber', 'vehicle.number', 'date','employee.number', 'description'];

  cscolumns: string[] = ['csdisonumber', 'csvehicle', 'csdate', 'csemployee', 'csdescription'];
  csprompts: string[] = ['Search by Number', 'Search by Vehicle', 'Search by Date', 'Search by Employee', 'Search by Description'];

  incolumns: string[] = ['item', 'qty', 'remove'];
  inheaders: string[] = ['Item', 'QTY','Remove',];
  inbinders: string[] = ['item.name', 'qty','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Disorderitem>;
  innerform!:FormGroup;
  items:Array<Item> = [];
  vehicles:Array<Vehicle> = [];
  disorderitems:Array<Disorderitem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disorder!: Disorder;
  olddisorder!: Disorder;

  today = new Date();

  disorders: Array<Disorder> = [];
  data!: MatTableDataSource<Disorder>;
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
  changedItems: Array<Disorderitem> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(
    private dios: DisorderService,
    private drqs: DisrequestsService,
    private itms: ItemService,
    private vehs: VehicleService,
    private emps: EmployeeService,
    private poss: Postatusservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager,
    private cdr: ChangeDetectorRef) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csdisonumber: new FormControl(),
      csvehicle: new FormControl(),
      csdate: new FormControl(),
      csemployee: new FormControl(),
      csdescription: new FormControl(),
    });

    this.ssearch = this.fb.group({
      sspostatus: new FormControl(),
      ssdisonumber: new FormControl(),
    });

    this.form =this.fb.group({
      "disonumber": new FormControl(this.today, [Validators.required],),
      "date": new FormControl(this.today, [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "disrequests": new FormControl('', [Validators.required]),
      "postatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "vehicle": new FormControl('', [Validators.required]),

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

    this.poss.getAllList().then((vsts: Postatus[]) => {
      this.postatuses = vsts;
    });

    this.drqs.getAll('').then((vsts: Disrequests[]) => {
      this.disrequestses = vsts;
    });

    this.emps.getAll('').then((vtys: Employee[]) => {
      this.employees = vtys;
    });

    this.vehs.getAll('').then((vbrs: Vehicle[]) => {
      this.vehicles = vbrs;
    });

    this.itms.getAll('').then((vbrs: Item[]) => {
      this.items = vbrs;
    });

    this.rs.get('disorder').then((regs: []) => {
      this.regexes = regs;
      this.rs.get('disorderitem').then((regs: []) => {
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

    this.form.controls['disonumber'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['disrequests'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['vehicle'].setValidators([Validators.required]);
    this.form.controls['postatus'].setValidators([Validators.required]);

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

          if (this.olddisorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.disorder[controlName]) {
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
          if (this.olddisorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.disorder[controlName]) {
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
      .then((emps: Disorder[]) => {
        this.disorders = emps;
        this.ns.setLastSequenceNumber(this.disorders[this.disorders.length-1].disonumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.disorders);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (disorder: Disorder, filter: string) => {
      return (cserchdata.csdate == null || disorder.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csdescription == null || disorder.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csdisonumber== null || disorder.disonumber.toLowerCase().includes(cserchdata.csdisonumber.toLowerCase())) &&
        (cserchdata.csemployee == null || disorder.employee.number.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csvehicle == null || disorder.vehicle.number.toLowerCase().includes(cserchdata.csvehicle.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let disonumber = sserchdata.ssdisonumber;
    let postatusid = sserchdata.sspostatus;


    let query = "";

    if (disonumber != null) query = query + "&disonumber=" + disonumber;
    if (postatusid != null) query = query + "&postatusid=" + postatusid;


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

  fillForm(disorder: Disorder){

    this.enableButtons(false,true,true);

    this.selectedrow = disorder;

    this.disorder = JSON.parse(JSON.stringify(disorder));

    this.olddisorder = JSON.parse(JSON.stringify(disorder));

    // @ts-ignore
    this.disorder.postatus= this.postatuses.find(g => g.id === this.disorder.postatus.id);
    // @ts-ignore
    this.disorder.employee = this.employees.find(e => e.id === this.disorder.employee.id);
    // @ts-ignore
    this.disorder.vehicle = this.vehicles.find(e => e.id === this.disorder.vehicle.id);
    // @ts-ignore
    this.disorder.disrequests = this.disrequestses.find(e => e.id === this.disorder.disrequests.id);


    this.indata = new MatTableDataSource(this.disorder.disorderitems);

    this.indata.data.forEach(e => {
      console.log(e.item);
    });
    this.form.patchValue(this.disorder);
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

      this.disorder = this.form.getRawValue();
      this.disorder.disorderitems = this.disorderitems;

      // @ts-ignore
      this.disorderitems.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.disorder.date;
      itmdata = itmdata + "<br>Description is : " + this.disorder.description;

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
          this.dios.add(this.disorder).then((responce: [] | undefined) => {
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
              this.innerform.reset();
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

            this.disorder = this.form.getRawValue();
            this.disorder.disorderitems = this.disorderitems;
            // @ts-ignore
            this.disorder.id =this.olddisorder.id;

            // @ts-ignore
            this.disorderitems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.disorder.date = this.dp.transform(this.disorder.date,"yyyy-MM-dd");


            this.dios.update(this.disorder).then((responce: [] | undefined) => {
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
        heading: "Confirmation - disorder Delete",
        message: "Are you sure to Delete following disorder? <br> <br>" + this.disorder.date+"id "+this.disorder.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dios.delete(this.disorder.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - disorder Delete ", message: delmessage}
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
        heading: "Confirmation - disorder Clear",
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

      let disorderitem = new  Disorderitem(this.id,this.innerdata.item,this.innerdata.qty);

      let tem: Disorderitem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.disorderitems = [];
      tem.forEach((t)=> this.disorderitems.push(t));

      this.disorderitems.push(disorderitem);
      this.indata = new MatTableDataSource(this.disorderitems);

      this.id++;

      this.updateItem(disorderitem);

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
    this.disorderitems = this.indata.data;

  }

  generateNumber(): void {
    const newInvoiceNumber = this.ns.generateNumber('DOR');
    this.form.controls['disonumber'].setValue(newInvoiceNumber);
  }

  updateItem(element: Disorderitem) {
    this.changedItems.push(element);
  }

}










