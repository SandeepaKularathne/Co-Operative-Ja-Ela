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
import { Pstatus } from 'src/app/entity/pstatus';
import { Pstatusservice } from 'src/app/service/pstatusservice';
import {Grn} from "../../../entity/grn";
import {Ptype} from "../../../entity/ptype";
import {GrnService} from "../../../service/grnservice";
import {Ptypeservice} from "../../../service/ptypeservice";
import {Vehicle} from "../../../entity/vehicle";
import {Supplier} from "../../../entity/supplier";
import {SupplierService} from "../../../service/supplierservice";
import {Supreitem} from "../../../entity/supreitem";
import {Supreturn} from "../../../entity/supreturn";
import {SupreturnService} from "../../../service/supreturnservice";
import {NumberService} from "../../../service/numberservice";
import {Item} from "../../../entity/item";



@Component({
  selector: 'app-supayment',
  templateUrl: './supayment.component.html',
  styleUrls: ['./supayment.component.css']
})

export class SupaymentComponent {

  columns: string[] = ['suppayno', 'supplier', 'grn', 'employee','modi'];
  headers: string[] = ['Payment Number', 'Supplier', 'Grn', 'Employee', 'Date'];
  binders: string[] = ['suppayno', 'supplier.registernumber', 'grn.grnnumber', 'employee.fullname','getModi()'];

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
  suppliers: Array<Supplier> = [];
  supreturns: Array<Supreturn> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private spays: Supaymentservice,
    private grs: GrnService,
    private emps: EmployeeService,
    private psts: Pstatusservice,
    private surs: SupreturnService,
    private ptys: Ptypeservice,
    private sups: SupplierService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      cssuppayno: new FormControl(),
      cssupplier: new FormControl(),
      csgrn: new FormControl(),
      csemployee: new FormControl(),
      csmodi: new FormControl(),
    });

    this.ssearch = this.fb.group({
      sssuppayno: new FormControl(),
      sspstatus: new FormControl(),
    });

    this.form =this.fb.group({
      "suppayno": new FormControl('', [Validators.required]),
      "grandtotal": new FormControl('', [Validators.required]),
      "supplier": new FormControl('', [Validators.required]),
      "grn": new FormControl('', [Validators.required]),
      "ptype": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "pstatus": new FormControl('', [Validators.required]),
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

    this.surs.getAll('').then((vsts: Supreturn[]) => {
      this.supreturns = vsts;
    });

    this.grs.getAll('').then((vsts: Grn[]) => {
      this.grns = vsts.filter(po => po.grnstatus.name != 'Cancelled');
    });

    this.sups.getAll('').then((vsts: Supplier[]) => {
      this.suppliers = vsts;
    });

    this.psts.getAllList().then((vsts: Pstatus[]) => {
      this.pstatuses = vsts;
    });

    this.ptys.getAllList().then((vsts: Ptype[]) => {
      this.ptypes = vsts;
    });

    this.createForm();
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['suppayno'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['supplier'].setValidators([Validators.required]);
    this.form.controls['grn'].setValidators([Validators.required]);
    this.form.controls['ptype'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['pstatus'].setValidators([Validators.required]);

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

    this.spays.getAll(query)
      .then((emps: Supayment[]) => {
        this.supayments = emps;
        this.ns.setLastSequenceNumber(this.supayments[this.supayments.length-1].suppayno);
        this.generateNumber();
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

  getModi(element: Supayment): string {

    const year = element.suppayno.slice(3, 7);
    const month = element.suppayno.slice(7, 9);
    const day = element.suppayno.slice(9, 11);
    const newDate = `${year} - ${month} - ${day}`;
    return newDate;

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (supayment: Supayment, filter: string) => {
      return (cserchdata.cssuppayno == null || supayment.suppayno.toLowerCase().includes(cserchdata.cssuppayno.toLowerCase())) &&
        (cserchdata.csgrn == null || supayment.grn.grnnumber.toLowerCase().includes(cserchdata.csgrn.toLowerCase())) &&
        (cserchdata.csmodi == null || this.getModi(supayment).toLowerCase().includes(cserchdata.csmodi.toLowerCase())) &&
        (cserchdata.csemployee== null || supayment.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cssupplier == null || supayment.supplier.registernumber.toLowerCase().includes(cserchdata.cssupplier.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let suppayno = sserchdata.sssuppayno;
    let pstatusid = sserchdata.sspstatus;

    let query = "";

    if (suppayno != null) query = query + "&suppayno=" + suppayno;
    if (pstatusid != null) query = query + "&pstatusid=" + pstatusid;

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

    //@ts-ignore
    this.supayment.grn = this.grns.find(s => s.id === this.supayment.grn.id);

    //@ts-ignore
    this.supayment.ptype = this.ptypes.find(s => s.id === this.supayment.ptype.id);

    //@ts-ignore
    this.supayment.pstatus = this.pstatuses.find(s => s.id === this.supayment.pstatus.id);

    //@ts-ignore
    this.supayment.supplier = this.suppliers.find(s => s.id === this.supayment.supplier.id);

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

      shdata = shdata + "<br> Supayment Number is : " + this.supayment.suppayno;

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
          this.spays.add(this.supayment).then((responce: [] | undefined) => {
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

            this.spays.update(this.supayment).then((responce: [] | undefined) => {
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
        message: "Are you sure to Delete following Supayment? <br> <br>" + this.supayment.suppayno
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.spays.delete(this.supayment.id).then((responce: [] | undefined) => {

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

  setGrandTotal() {
    let grn = this.form.controls['grn'].value;

    let gnumber = grn.grnnumber;
    let gpayment: number = this.grns.find(s => s.grnnumber === gnumber)?.grandtotal ?? 0;
    let greturn: number = this.supreturns.find(s => s.grn.grnnumber === gnumber)?.grandtotal ?? 0;
    let gpaied: number = parseFloat(this.supayments.find(s => s.grn.grnnumber === gnumber)?.grandtotal ?? '0');
    let total: number = gpayment - greturn - gpaied;
    this.form.controls['grandtotal'].setValue(total);

    let supplier = grn.purorder?.supplier ?? null;
    this.form.controls['supplierl'].setValue(supplier);
  }

  generateNumber(): void {
    const newNumber = this.ns.generateNumber('SAY');
    this.form.controls['suppayno'].setValue(newNumber);
  }

  total=0;

  filteritem(){

    let e = this.form.controls['grn'].value.id;

    this.grs.getGrntotal(e).then((msys: Grn[]) => {
      msys.forEach(i => {
        this.total = this.total + i.grandtotal
      })
    });

    this.surs.getReptotal(e).then((msys: Supreturn[]) => {
      msys.forEach(i => {
        this.total = this.total - i.grandtotal
      })
    });

    this.sups.getSupplierByGrn(e).then((msys: Supplier[]) => {
      this.suppliers = msys;
    });
    if(this.total!=0)this.form.controls['grandtotal'].setValue(this.total);
    this.total=0;
  }
}










