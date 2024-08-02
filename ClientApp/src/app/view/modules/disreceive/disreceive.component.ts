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
import { Disreceive } from 'src/app/entity/disreceive';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Disreceiveservice } from 'src/app/service/disreceiveservice';
import {Disorder} from "../../../entity/disorder";
import {DisorderService} from "../../../service/disorderservice";
import {NumberService} from "../../../service/numberservice";

@Component({
  selector: 'app-disreceive',
  templateUrl: './disreceive.component.html',
  styleUrls: ['./disreceive.component.css']
})

export class DisreceiveComponent {


  columns: string[] = ['disrecnumber', 'disorder', 'date', 'employee','description'];
  headers: string[] = ['Disreceive Number', 'Order Number', 'Date', 'Employee', 'Description'];
  binders: string[] = ['disrecnumber', 'disorder.disonumber', 'date', 'employee.fullname','description'];

  cscolumns: string[] = ['csdisrecnumber', 'csdisorder', 'csdate', 'csemployee', 'csdescription'];
  csprompts: string[] = ['Search by Disreceive Number', 'Search by Order Number', 'Search by Date', 'Search by Employee', 'Search by Description'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disreceive!: Disreceive;
  olddisreceive!: Disreceive;

  disreceives: Array<Disreceive> = [];
  data!: MatTableDataSource<Disreceive>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  employees: Array<Employee> = [];
  disorders: Array<Disorder> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private dirs: Disreceiveservice,
    private emps: EmployeeService,
    private dors: DisorderService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csdisrecnumber: new FormControl(),
      csdisorder: new FormControl(),
      csdate: new FormControl(),
      csdescription: new FormControl(),
      csemployee: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssdisorder: new FormControl(),
      ssemployee: new FormControl(),
    });

    this.form =this.fb.group({
      "disrecnumber": new FormControl('', [Validators.required]),
      "disorder": new FormControl('', [Validators.required]),
      "date": new FormControl('', [Validators.required]),
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

    this.dors.getAll('').then((vsts: Disorder[]) => {
      this.disorders = vsts.filter(po => po.postatus.name == 'Approved' || po.postatus.name == 'Closed');

    });

    this.rs.get('disreceive').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['disrecnumber'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['disorder'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olddisreceive != undefined && control.valid) {
            // @ts-ignore
            if (value === this.disreceive[controlName]) {
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
      .then((emps: Disreceive[]) => {
        this.disreceives = emps;
        this.ns.setLastSequenceNumber(this.disreceives[this.disreceives.length-1].disrecnumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.disreceives);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (disreceive: Disreceive, filter: string) => {
      return (cserchdata.csdisrecnumber == null || disreceive.disrecnumber.toLowerCase().includes(cserchdata.csdisrecnumber.toLowerCase())) &&
        (cserchdata.csdescription == null || disreceive.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csdate == null || disreceive.date.toLowerCase().includes(cserchdata.csdate.toLowerCase())) &&
        (cserchdata.csemployee== null || disreceive.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csdisorder== null || disreceive.disorder.disonumber.toLowerCase().includes(cserchdata.csdisorder.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let disorderid = sserchdata.ssdisorder;
    let employeeid = sserchdata.ssemployee;

    let query = "";

    if (disorderid != null) query = query + "&disorderid=" + disorderid;
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

  fillForm(disreceive: Disreceive) {

    this.enableButtons(false,true,true);

    this.selectedrow=disreceive;

    this.disreceive = JSON.parse(JSON.stringify(disreceive));
    this.olddisreceive = JSON.parse(JSON.stringify(disreceive));

    //@ts-ignore
    this.disreceive.employee = this.employees.find(s => s.id === this.disreceive.employee.id);

    //@ts-ignore
    this.disreceive.disorder = this.disorders.find(s => s.id === this.disreceive.disorder.id);

    this.form.patchValue(this.disreceive);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Disreceive Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.disreceive = this.form.getRawValue();

      let shdata: string = "";

      shdata = shdata + "<br> Disreceive Number is : " + this.disreceive.disrecnumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Disreceive Add",
          message: "Are you sure to Add the following Disreceive? <br> <br>" + shdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.dirs.add(this.disreceive).then((responce: [] | undefined) => {
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
              setTimeout(() => {window.location.reload();}, 2000);
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Disreceive Add", message: addmessage}
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
            this.disreceive = this.form.getRawValue();

            this.disreceive.id = this.olddisreceive.id;

            this.dirs.update(this.disreceive).then((responce: [] | undefined) => {
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
        heading: "Confirmation - Disreceive Delete",
        message: "Are you sure to Delete following Disreceive? <br> <br>" + this.disreceive.disrecnumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.dirs.delete(this.disreceive.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Disreceive Delete ", message: delmessage}
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
        heading: "Confirmation - Disreceive Clear",
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

  generateNumber(): void {
    const newNumber = this.ns.generateNumber('DRO');
    this.form.controls['disrecnumber'].setValue(newNumber);
  }

}










