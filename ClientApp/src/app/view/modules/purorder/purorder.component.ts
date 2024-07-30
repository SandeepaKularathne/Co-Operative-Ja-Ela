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
import { Purorder } from 'src/app/entity/purorder';
import { Postatusservice } from 'src/app/service/postatusservice';
import { Postatus } from 'src/app/entity/postatus';
import { PurorderService } from 'src/app/service/Purorderservice';
import { Employee } from 'src/app/entity/employee';
import { Item } from 'src/app/entity/item';
import { Poitem } from 'src/app/entity/poitem';
import { ItemService } from 'src/app/service/itemservice';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Supplier } from 'src/app/entity/supplier';
import { SupplierService } from 'src/app/service/supplierservice';
import { NumberService } from 'src/app/service/numberservice';

@Component({
  selector: 'app-purorder',
  templateUrl: './purorder.component.html',
  styleUrls: ['./purorder.component.css']
})

export class PurorderComponent {


  columns: string[] = ['ponumber', 'employee', 'postatus', 'date', 'description', 'expectedcost'];
  headers: string[] = ['Ponumber', 'Employee', 'Status', 'Date', 'Description', 'Expected Cost'];
  binders: string[] = ['ponumber', 'employee.fullname', 'postatus.name', 'date', 'description', 'expectedcost'];

  cscolumns: string[] = ['csponumber', 'csemployee', 'cspostatus', 'csdate', 'csdescription', 'csexpectedcost'];
  csprompts: string[] = ['Search by Ponumber', 'Search by Employee', 'Search by Status', 'Search by Date', 'Search by Description', 'Search by Expected Cost'];

  incolumns: string[] = ['item', 'qty', 'explinetotal', 'remove'];
  inheaders: string[] = ['Item', 'QTY', 'Line total', 'Remove',];
  inbinders: string[] = ['item.name', 'qty', 'explinetotal', 'getBtn()'];

  innerdata: any;
  oldinnerdata: any;

  indata!: MatTableDataSource<Poitem>;
  innerform!: FormGroup;
  items: Array<Item> = [];
  poitems: Array<Poitem> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  purorder!: Purorder;
  oldpurorder!: Purorder;

  purorders: Array<Purorder> = [];
  data!: MatTableDataSource<Purorder>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  postatuses: Array<Postatus> = [];
  employees: Array<Employee> = [];
  suppliers: Array<Supplier> = [];

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;


  constructor(
    private pos: PurorderService,
    private poss: Postatusservice,
    private itms: ItemService,
    private emps: EmployeeService,
    private sups: SupplierService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    private ns: NumberService,
    public authService: AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csponumber: new FormControl(),
      csemployee: new FormControl(),
      cspostatus: new FormControl(),
      csdate: new FormControl(),
      csdescription: new FormControl(),
      csexpectedcost: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssponumber: new FormControl(),
      sspostatus: new FormControl(),
    });

    this.form = this.fb.group({
      "ponumber": new FormControl('', [Validators.required]),
      "date": new FormControl('', [Validators.required]),
      "expectedcost": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "postatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "supplier": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    this.innerform = this.fb.group({
      "item": new FormControl('', [Validators.required]),
      "qty": new FormControl('', [Validators.required]),
      "explinetotal": new FormControl('', [Validators.required]),
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

    this.emps.getAll('').then((vsts: Employee[]) => {
      this.employees = vsts;
    });

    this.sups.getAll('').then((vsts: Supplier[]) => {
      this.suppliers = vsts;
    });

    this.itms.getAll('').then((vsts: Item[]) => {
      this.items = vsts;
    });

    this.rs.get('purorder').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['ponumber'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['expectedcost'].setValidators([Validators.required, Validators.pattern(this.regexes['expectedcost']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['postatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['supplier'].setValidators([Validators.required]);

    this.innerform.controls['item'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
    this.innerform.controls['explinetotal'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldpurorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purorder[controlName]) {
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

    this.enableButtons(true, false, false);
  }

  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.pos.getAll(query)
      .then((emps: Purorder[]) => {
        this.purorders = emps;
        this.ns.setLastSequenceNumber(this.purorders[this.purorders.length-1].ponumber);
        this.generateNumber();
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purorders.slice().reverse());
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (purorder: Purorder, filter: string) => {
      // @ts-ignore
      return (cserchdata.csponumber == null || purorder.ponumber.toLowerCase().includes(cserchdata.csponumber.toLowerCase())) &&
        (cserchdata.csemployee == null || purorder.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cspostatus == null || purorder.postatus.name.toLowerCase().includes(cserchdata.cspostatus.toLowerCase())) &&
        (cserchdata.csdescription == null || purorder.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csexpectedcost == null || purorder.expectedcost == cserchdata.csexpectedcost)&&
        (cserchdata.csdate == null || purorder.date.includes(cserchdata.csitem.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let ponumber = sserchdata.ssponumber;
    let postatusid = sserchdata.sspostatus;

    let query = "";

    if (ponumber != null && ponumber.trim() != "") query = query + "&ponumber=" + ponumber;
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

  fillForm(purorder: Purorder) {

    this.enableButtons(false, true, true);

    this.selectedrow = purorder;

    this.purorder = JSON.parse(JSON.stringify(purorder));
    this.oldpurorder = JSON.parse(JSON.stringify(purorder));


    //@ts-ignore
    this.purorder.postatus = this.postatuses.find(s => s.id === this.purorder.postatus.id);
    //@ts-ignore
    this.purorder.employee = this.employees.find(e => e.id === this.purorder.employee.id);
    //@ts-ignore
    this.purorder.supplier = this.suppliers.find(e => e.id === this.purorder.supplier.id);

    this.indata = new MatTableDataSource(this.purorder.poitems);
    this.form.patchValue(this.purorder);
    this.form.markAsPristine();
    this.calculateGrandTotal();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purorder Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {


      this.purorder = this.form.getRawValue();
      this.purorder.poitems = this.poitems;
      // @ts-ignore
      this.poitems.forEach((i )=> delete i.id);

      let vehdata: string = "";

      vehdata = vehdata + "<br>Ponumber is : " + this.purorder.ponumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Purorder Add",
          message: "Are you sure to Add the following Purorder? <br> <br>" + vehdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.pos.add(this.purorder).then((responce: [] | undefined) => {
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
              this.indata.data = [];
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Purorder Add", message: addmessage}
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
        data: {heading: "Errors - Purorder Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Purorder Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.purorder = this.form.getRawValue();
            this.purorder.poitems = this.poitems;

            this.purorder.id = this.oldpurorder.id;

            // @ts-ignore
            this.poitems.forEach((i)=> delete  i.id);


            // @ts-ignore
            this.purorder.date = this.dp.transform(this.purorder.date,"yyyy-MM-dd");

            this.pos.update(this.purorder).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.innerform.reset();
                this.loadTable("");
                this.indata.data = [];
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Purorder Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Purorder Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }


  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purorder Delete",
        message: "Are you sure to Delete following Purorder? <br> <br>" + this.purorder.ponumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.purorder.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
            this.indata.data = [];
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Purorder Delete ", message: delmessage}
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

  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purorder Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
        window.location.reload();
      }
    });
    this.enableButtons(true, false, false);
  }

  //inner table

  id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();
    console.log(this.innerdata);

    if (this.innerdata != null) {

      let explinetotal =this.innerdata.qty * this.innerdata.explinetotal;
      let poitem = new Poitem(this.id,this.innerdata.qty, explinetotal, this.innerdata.item);

      let tem: Poitem[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.poitems = [];
      tem.forEach((t) => this.poitems.push(t));

      this.poitems.push(poitem);
      this.indata = new MatTableDataSource(this.poitems);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal() {

    let expectedcost=0;
    this.indata.data.forEach((m) => {
      expectedcost = expectedcost + m.explinetotal
    })
    let roundedValue = parseFloat(expectedcost.toString()).toFixed(2);
    this.form.controls['expectedcost'].setValue(roundedValue);
  }

  deleteRaw(x: any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.poitems = this.indata.data;

    this.calculateGrandTotal();
  }

  filterlinecost(){
    let i = this.innerform.controls['item'].value.pprice;
    let roundedValue = parseFloat(i).toFixed(2);
    this.innerform.controls['explinetotal'].setValue(roundedValue);
  }

  generateNumber(): void {
    const newNumber = this.ns.generateNumber('POR');
    this.form.controls['ponumber'].setValue(newNumber);
  }

  filteritem(){
    let supplier = this.form.controls['supplier'].value.id;
    this.itms.getItemBySupplier(supplier).then((msys: Item[]) => {
      this.items = msys;
    });
  }

}












