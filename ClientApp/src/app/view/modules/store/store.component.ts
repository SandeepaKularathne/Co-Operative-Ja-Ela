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
import { Store } from 'src/app/entity/store';
import { Employee } from 'src/app/entity/employee';
import { StoreService } from 'src/app/service/Storeservice';
import { EmployeeService } from 'src/app/service/employeeservice';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})

export class StoreComponent {


  columns: string[] = ['storenumber', 'location', 'esdate', 'employee','cnumber', 'mail'];
  headers: string[] = ['Store Number', 'Location', 'Date', 'A.Employee', 'Contact Number','Email'];
  binders: string[] = ['storenumber', 'location', 'esdate', 'employee.fullname','cnumber', 'email'];

  cscolumns: string[] = ['csstorenumber', 'cslocation', 'csesdate', 'csemployee', 'cscnumber', 'csemail'];
  csprompts: string[] = ['Search by Store Number', 'Search by Location', 'Search by Date', 'Search by Employee', 'Search by C.No', 'Search by Email'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  store!: Store;
  oldstore!: Store;

  stores: Array<Store> = [];
  data!: MatTableDataSource<Store>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  employees: Array<Employee> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private sts: StoreService,
    private emps: EmployeeService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csstorenumber: new FormControl(),
      cslocation: new FormControl(),
      csesdate: new FormControl(),
      cscnumber: new FormControl(),
      csemployee: new FormControl(),
      csemail: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssstorenumber: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "storenumber": new FormControl('', [Validators.required]),
      "location": new FormControl('', [Validators.required]),
      "esdate": new FormControl('', [Validators.required]),
      "cnumber": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.emps.getAll('').then((vsts: Employee[]) => {
      this.employees = vsts;
    });

    this.rs.get('store').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['storenumber'].setValidators([Validators.required, Validators.pattern(this.regexes['storenumber']['regex'])]);
    this.form.controls['location'].setValidators([Validators.required]);
    this.form.controls['esdate'].setValidators([Validators.required]);
    this.form.controls['cnumber'].setValidators([Validators.required, Validators.pattern(this.regexes['cnumber']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "esdate" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldstore != undefined && control.valid) {
            // @ts-ignore
            if (value === this.store[controlName]) {
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

    this.sts.getAll(query)
      .then((emps: Store[]) => {
        this.stores = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.stores);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (store: Store, filter: string) => {
      return (cserchdata.csstorenumber == null || store.storenumber.toLowerCase().includes(cserchdata.csstorenumber.toLowerCase())) &&
        (cserchdata.cslocation == null || store.location.toLowerCase().includes(cserchdata.cslocation.toLowerCase())) &&
        (cserchdata.csesdate == null || store.esdate.toLowerCase().includes(cserchdata.csesdate.toLowerCase())) &&
        (cserchdata.csemployee== null || store.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cscnumber == null || store.cnumber.toLowerCase().includes(cserchdata.cscnumber.toLowerCase())) &&
        (cserchdata.csemail == null || store.email.toLowerCase().includes(cserchdata.csemail.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let storenumber = sserchdata.ssstorenumber;
    let employeeid = sserchdata.ssemployee;

    let query = "";

    if (storenumber != null && storenumber.trim() != "") query = query + "&storenumber=" + storenumber;
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

  fillForm(store: Store) {

    this.enableButtons(false,true,true);

    this.selectedrow=store;

    this.store = JSON.parse(JSON.stringify(store));
    this.oldstore = JSON.parse(JSON.stringify(store));
    
    //@ts-ignore
    this.store.employee = this.employees.find(s => s.id === this.store.employee.id);

    this.form.patchValue(this.store);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Store Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.store = this.form.getRawValue();

      let vehdata: string = "";

      vehdata = vehdata + "<br>Number is : " + this.store.storenumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Store Add",
          message: "Are you sure to Add the following Store? <br> <br>" + vehdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.sts.add(this.store).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Store Add", message: addmessage}
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
        data: {heading: "Errors - Store Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Store Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.store = this.form.getRawValue();

            this.store.id = this.oldstore.id;

            this.sts.update(this.store).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Store Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Store Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Store Delete",
        message: "Are you sure to Delete following Store? <br> <br>" + this.store.storenumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sts.delete(this.store.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Store Delete ", message: delmessage}
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
        heading: "Confirmation - Store Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.loadTable('');
      }
    });
    this.enableButtons(true,false,false);
  }

}










