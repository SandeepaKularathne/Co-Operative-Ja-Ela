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
import { Disrequests } from 'src/app/entity/disrequests';
import { DisrequestsService } from 'src/app/service/disrequestsservice';
import { Disstatusservice } from 'src/app/service/disstatusservice';
import { Disstatus } from 'src/app/entity/disstatus';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Disitem } from 'src/app/entity/disitem';
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
import { Shop } from 'src/app/entity/shop';
import { Shopservice } from 'src/app/service/shopservice';
import { NumberService } from 'src/app/service/numberservice';


@Component({
  selector: 'app-disrequests',
  templateUrl: './disrequests.component.html',
  styleUrls: ['./disrequests.component.css']
})

export class DisrequestsComponent {


  columns: string[] = ['disnumber', 'disstatus', 'shop', 'reqdate','employee', 'description'];
  headers: string[] = ['Number', 'Status', 'Shop', 'Date', 'Employee No','Description'];
  binders: string[] = ['disnumber', 'disstatus.name', 'shop.shopnumber', 'reqdate','employee.number', 'description'];

  cscolumns: string[] = ['csdisnumber', 'csdisstatus', 'csshop', 'csreqdate', 'csemployee', 'csdescription'];
  csprompts: string[] = ['Search by Number', 'Search by Status', 'Search by Shop', 'Search by Date', 'Search by Employee', 'Search by Description'];

  incolumns: string[] = ['item', 'qty', 'remove'];
  inheaders: string[] = ['Item', 'QTY','Remove',];
  inbinders: string[] = ['item.name', 'qty','getBtn()'];

  innerdata:any;
  oldinnerdata:any;

  indata!:MatTableDataSource<Disitem>
  innerform!:FormGroup;
  items:Array<Item> = [];
  shops:Array<Shop> = [];
  disitems:Array<Disitem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disrequests!: Disrequests;
  olddisrequests!: Disrequests;

  today = new Date();

  disrequestss: Array<Disrequests> = [];
  data!: MatTableDataSource<Disrequests>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  disstatuses: Array<Disstatus> = [];
  employees: Array<Employee> = [];

  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private dis: DisrequestsService,
    private itms: ItemService,
    private shos: Shopservice,
    private emps: EmployeeService,
    private diss: Disstatusservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csdisnumber: new FormControl(),
      csdisstatus: new FormControl(),
      csshop: new FormControl(),
      csreqdate: new FormControl(),
      csemployee: new FormControl(),
      csdescription: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssdisnumber: new FormControl(),
      ssdisstatus: new FormControl(),
    });

    this.form =this.fb.group({
      "reqdate": new FormControl(this.today, [Validators.required],),
      "description": new FormControl('', [Validators.required]),
      "disnumber": new FormControl('', [Validators.required]),
      "disstatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "shop": new FormControl('', [Validators.required]),

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

    this.diss.getAllList().then((vsts: Disstatus[]) => {
      this.disstatuses = vsts;
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

    this.rs.get('disrequests').then((regs: []) => {
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

    this.form.controls['reqdate'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['disnumber'].setValidators([Validators.required]);
    this.form.controls['disstatuse'];
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['shop'].setValidators([Validators.required]);


    this.innerform.controls['qty'].setValidators([Validators.required]);
    this.innerform.controls['item'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "ssrqdate" || controlName == "ssrqdate")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olddisrequests != undefined && control.valid) {
            // @ts-ignore
            if (value === this.disrequests[controlName]) {
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
          if (this.olddisrequests != undefined && control.valid) {
            // @ts-ignore
            if (value === this.disrequests[controlName]) {
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

    this.dis.getAll(query)
      .then((emps: Disrequests[]) => {
        this.disrequestss = emps;
        this.ns.setLastSequenceNumber(this.disrequestss[this.disrequestss.length-1].disnumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.disrequestss);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (disrequests: Disrequests, filter: string) => {
      return (cserchdata.csreqdate == null || disrequests.reqdate.toLowerCase().includes(cserchdata.csreqdate.toLowerCase())) &&
        (cserchdata.csdescription == null || disrequests.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csdisstatus == null || disrequests.disstatus.name.toLowerCase().includes(cserchdata.csdisstatus.toLowerCase())) &&
        (cserchdata.csdisnumber== null || disrequests.disnumber.toLowerCase().includes(cserchdata.csdisnumber.toLowerCase())) &&
        (cserchdata.csemployee == null || disrequests.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csshop == null || disrequests.shop.shopnumber.toLowerCase().includes(cserchdata.csshop.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let disnumber = sserchdata.ssdisnumber;
    let disstatusid = sserchdata.ssdisstatus;


    let query = "";

    if (disnumber != null) query = query + "&disnumber=" + disnumber;
    if (disstatusid != null) query = query + "&disstatusid=" + disstatusid;


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

  fillForm(disrequests: Disrequests){

    this.enableButtons(false,true,true);

    this.selectedrow = disrequests;

    this.disrequests = JSON.parse(JSON.stringify(disrequests));

    this.olddisrequests = JSON.parse(JSON.stringify(disrequests));

    // @ts-ignore
    this.disrequests.disstatus = this.disstatuses.find(g => g.id === this.disrequests.disstatus.id);
    // @ts-ignore
    this.disrequests.employee = this.employees.find(e => e.id === this.disrequests.employee.id);
    // @ts-ignore
    this.disrequests.shop = this.shops.find(e => e.id === this.disrequests.shop.id);


    this.indata = new MatTableDataSource(this.disrequests.disitems);

    this.form.patchValue(this.disrequests);
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

      this.disrequests = this.form.getRawValue();
      this.disrequests.disitems = this.disitems;

      // @ts-ignore
      this.disitems.forEach((i )=> delete i.id);

      let itmdata: string = "";

      itmdata = itmdata + "<br>Date is : " + this.disrequests.reqdate;
      itmdata = itmdata + "<br>Description is : " + this.disrequests.description;

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
          this.dis.add(this.disrequests).then((responce: [] | undefined) => {
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
        data: {heading: "Errors - disrequests Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - disrequests Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.disrequests = this.form.getRawValue();
            this.disrequests.disitems = this.disitems;
            // @ts-ignore
            this.disrequests.id =this.olddisrequests.id;

            // @ts-ignore
            this.disrequestsitems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.disrequests.date = this.dp.transform(this.disrequests.date,"yyyy-MM-dd");


            this.dis.update(this.disrequests).then((responce: [] | undefined) => {
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
                data: {heading: "Status -disrequests Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - disrequests Update", message: "Nothing Changed"}
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
    return updates;
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - disrequests Delete",
        message: "Are you sure to Delete following disrequests? <br> <br>" + this.disrequests.reqdate+"id "+this.disrequests.id
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dis.delete(this.disrequests.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - disrequests Delete ", message: delmessage}
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
        heading: "Confirmation - disrequests Clear",
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

      let disrequestsitem = new  Disitem(this.id,this.innerdata.item,this.innerdata.qty);

      let tem: Disitem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.disitems = [];
      tem.forEach((t)=> this.disitems.push(t));

      this.disitems.push(disrequestsitem);
      this.indata = new MatTableDataSource(this.disitems);

      this.id++;

      this.innerform.reset();

    }

  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.disitems = this.indata.data;

  }

  generateNumber(): void {
    const newInvoiceNumber = this.ns.generateNumber('DRQ');
    this.form.controls['disnumber'].setValue(newInvoiceNumber);
  }
}










