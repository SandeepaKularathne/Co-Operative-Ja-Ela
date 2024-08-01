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
import { Deposits } from 'src/app/entity/deposits';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Depositseservice } from 'src/app/service/depositsservice';
import {Shop} from "../../../entity/shop";
import {Shopservice} from "../../../service/shopservice";
import {NumberService} from "../../../service/numberservice";
import {Item} from "../../../entity/item";
import {Invoice} from "../../../entity/invoice";
import {InvoiceService} from "../../../service/invoiceservice";
import {CustomerreturnService} from "../../../service/customerreturnservice";
import {Customerreturn} from "../../../entity/customerreturn";

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})

export class DepositsComponent {


  columns: string[] = ['totaldeposit', 'shop', 'date', 'employee','description'];
  headers: string[] = ['Deposits Number', 'Shop', 'Date', 'Employee', 'Description'];
  binders: string[] = ['totaldeposit', 'shop.shopnumber', 'date', 'employee.fullname','description'];

  cscolumns: string[] = ['cstotaldeposit', 'csshop', 'csdate', 'csemployee', 'csdescription'];
  csprompts: string[] = ['Search by Deposits Number', 'Search by Shop', 'Search by Date', 'Search by Employee', 'Search by Description'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  deposits!: Deposits;
  olddeposits!: Deposits;

  depositss: Array<Deposits> = [];
  data!: MatTableDataSource<Deposits>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  today = new Date();
  employees: Array<Employee> = [];
  shops: Array<Shop> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private dirs: Depositseservice,
    private cus: CustomerreturnService,
    private emps: EmployeeService,
    private shps: Shopservice,
    private invs: InvoiceService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      cstotaldeposit: new FormControl(),
      csshop: new FormControl(),
      csdate: new FormControl(),
      csdescription: new FormControl(),
      csemployee: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssshop: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "totaldeposit": new FormControl('', [Validators.required]),
      "shop": new FormControl('', [Validators.required]),
      "date": new FormControl(this.today, [Validators.required]),
      "description": new FormControl('', [Validators.required]),
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

    this.shps.getAll('').then((vsts: Shop[]) => {
      this.shops = vsts;
    });

    this.rs.get('disorder').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['totaldeposit'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['shop'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olddeposits != undefined && control.valid) {
            // @ts-ignore
            if (value === this.deposits[controlName]) {
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

    this.dirs.getAll(query)
      .then((emps: Deposits[]) => {
        this.depositss = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.depositss);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (deposits: Deposits, filter: string) => {
      return (cserchdata.cstotaldeposit == null || deposits.totaldeposit.toString().toLowerCase().includes(cserchdata.cstotaldeposit.toLowerCase())) &&
        (cserchdata.csdescription == null || deposits.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csdate == null || deposits.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csemployee== null || deposits.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csshop== null || deposits.shop.shopnumber.toLowerCase().includes(cserchdata.csshop.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let shopid = sserchdata.ssshop;
    let employeeid = sserchdata.ssemployee;

    let query = "";

    if (shopid != null) query = query + "&shopid=" + shopid;
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

  fillForm(deposits: Deposits) {

    this.enableButtons(false,true,true);

    this.selectedrow=deposits;

    this.deposits = JSON.parse(JSON.stringify(deposits));
    this.olddeposits = JSON.parse(JSON.stringify(deposits));

    //@ts-ignore
    this.deposits.employee = this.employees.find(s => s.id === this.deposits.employee.id);

    //@ts-ignore
    this.deposits.shop = this.shops.find(s => s.id === this.deposits.shop.id);

    this.form.patchValue(this.deposits);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Deposits Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.deposits = this.form.getRawValue();

      let shdata: string = "";

      shdata = shdata + "<br> Deposits Number is : " + this.deposits.totaldeposit;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Deposits Add",
          message: "Are you sure to Add the following Deposits? <br> <br>" + shdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.dirs.add(this.deposits).then((responce: [] | undefined) => {
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
              this.loadTable('');
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Deposits Add", message: addmessage}
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
            this.deposits = this.form.getRawValue();

            this.deposits.id = this.olddeposits.id;

            this.dirs.update(this.deposits).then((responce: [] | undefined) => {
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
                this.enableButtons(true,false,false);
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
        heading: "Confirmation - Deposits Delete",
        message: "Are you sure to Delete following Deposits? <br> <br>" + this.deposits.totaldeposit
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dirs.delete(this.deposits.id).then((responce: [] | undefined) => {

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
            this.enableButtons(true,false,false);
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Deposits Delete ", message: delmessage}
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
        heading: "Confirmation - Deposits Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.loadTable('');
        this.enableButtons(true,false,false);
      }
    });

  }
  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  total=0;

  filteritem(){
    let id = this.form.controls['shop'].value.id;

    this.invs.getInvByshop(id).then((msys: Invoice[]) => {
      msys.forEach(i => {
        this.total = this.total + i.grandtotal
      })
    });
    this.cus.getReqByshopr(id).then((msys: Customerreturn[]) => {
      msys.forEach(i => {
        this.total = this.total - i.grandtotal
      })
    });
    this.form.controls['totaldeposit'].setValue(this.total);
    this.total=0;
  }

}










