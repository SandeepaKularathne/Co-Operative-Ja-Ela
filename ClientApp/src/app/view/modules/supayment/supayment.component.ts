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
import { Supayment } from 'src/app/entity/supayment';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Supaymentservice } from 'src/app/service/supaymentservice';
import { Supaymentstatus } from 'src/app/entity/supaymentstatus';
import { Supaymentstatusservice } from 'src/app/service/supaymentstatusservice';



@Component({
  selector: 'app-supayment',
  templateUrl: './supayment.component.html',
  styleUrls: ['./supayment.component.css']
})

export class SupaymentComponent {

  columns: string[] = ['suppayno', 'supplier', 'grn', 'employee','modi'];
  headers: string[] = ['Payment Number', 'Supplier', 'Grn', 'Employee', 'Date'];
  binders: string[] = ['suppayno', 'supplier.supnumber', 'grn.grnnumber', 'employee.fullname','getModi()'];

  cscolumns: string[] = ['cssuppayno', 'cssupplier', 'csgrn', 'csemployee', 'csmodi'];
  csprompts: string[] = ['Search by Payment Number', 'Search by Grn', 'Search by Date', 'Search by Employee', 'Search by Date'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  supayment!: Supayment;
  oldsupayment!: Supayment;

  supayments: Array<Supayment> = [];
  data!: MatTableDataSource<Supayment>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  employees: Array<Employee> = [];
  pstatuses: Array<Pstatus> = [];
  grns: Array<Grn> = [];
  ptypes: Array<Ptype> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private shs: Supaymentservice,
    private emps: EmployeeService,
    private shss: Supaymentstatusservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      cssupaymentnumber: new FormControl(),
      csaddress: new FormControl(),
      csopdate: new FormControl(),
      cscnumber: new FormControl(),
      csemployee: new FormControl(),
      csemail: new FormControl(),
    });

    this.ssearch = this.fb.group({
      sssupaymentstatus: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "supaymentnumber": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "opdate": new FormControl('', [Validators.required]),
      "cnumber": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "supaymentstatus": new FormControl('', [Validators.required]),
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

    this.shss.getAllList().then((vsts: Supaymentstatus[]) => {
      this.supaymentstatuses = vsts;
    });

    this.rs.get('supayment').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['supaymentnumber'].setValidators([Validators.required, Validators.pattern(this.regexes['supaymentnumber']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['opdate'].setValidators([Validators.required]);
    this.form.controls['cnumber'].setValidators([Validators.required, Validators.pattern(this.regexes['cnumber']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['supaymentstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "opdate" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldsupayment != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supayment[controlName]) {
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

    this.shs.getAll(query)
      .then((emps: Supayment[]) => {
        this.supayments = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.supayments);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (supayment: Supayment, filter: string) => {
      return (cserchdata.cssupaymentnumber == null || supayment.supaymentnumber.toLowerCase().includes(cserchdata.cssupaymentnumber.toLowerCase())) &&
        (cserchdata.cslocation == null || supayment.address.toLowerCase().includes(cserchdata.cslocation.toLowerCase())) &&
        (cserchdata.csesdate == null || supayment.opdate.toLowerCase().includes(cserchdata.csesdate.toLowerCase())) &&
        (cserchdata.csemployee== null || supayment.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cscnumber == null || supayment.cnumber.toLowerCase().includes(cserchdata.cscnumber.toLowerCase())) &&
        (cserchdata.csemail == null || supayment.email.toLowerCase().includes(cserchdata.csemail.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let supaymentstatusid = sserchdata.sssupaymentstatus;
    let employeeid = sserchdata.ssemployee;

    let query = "";

    if (supaymentstatusid != null) query = query + "&supaymentstatusid=" + supaymentstatusid;
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

  fillForm(supayment: Supayment) {

    this.enableButtons(false,true,true);

    this.selectedrow=supayment;

    this.supayment = JSON.parse(JSON.stringify(supayment));
    this.oldsupayment = JSON.parse(JSON.stringify(supayment));

    //@ts-ignore
    this.supayment.employee = this.employees.find(s => s.id === this.supayment.employee.id);

    this.form.patchValue(this.supayment);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supayment Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.supayment = this.form.getRawValue();

      let shdata: string = "";

      shdata = shdata + "<br> Supayment Number is : " + this.supayment.supaymentnumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supayment Add",
          message: "Are you sure to Add the following Supayment? <br> <br>" + shdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.shs.add(this.supayment).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Supayment Add", message: addmessage}
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
            this.supayment = this.form.getRawValue();

            this.supayment.id = this.oldsupayment.id;

            this.shs.update(this.supayment).then((responce: [] | undefined) => {
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
        heading: "Confirmation - Supayment Delete",
        message: "Are you sure to Delete following Supayment? <br> <br>" + this.supayment.supaymentnumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.shs.delete(this.supayment.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Supayment Delete ", message: delmessage}
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
        heading: "Confirmation - Supayment Clear",
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
}










