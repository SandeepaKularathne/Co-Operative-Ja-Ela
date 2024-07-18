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
import { Supplier } from 'src/app/entity/supplier';
import { SupplierService } from 'src/app/service/supplierservice';
import { Supplierstatus } from 'src/app/entity/supplierstatus';
import {Supplierstype } from 'src/app/entity/supplierstype';
import { Category } from 'src/app/entity/category';
import { Supplierstatusservice } from 'src/app/service/supplierstatusservice';
import { Supplierstypeservice } from 'src/app/service/supplierstypeservice';
// @ts-ignore
import { Categoryservice } from 'src/app/service/Categoryservice';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})

export class SupplierComponent {


  columns: string[] = ['name', 'registernumber', 'supplierstatus', 'supplierstype','contactnumber', 'officetp'];
  headers: string[] = ['Name', 'R Number', 'Status', 'Type', 'Contact Number','Office TP'];
  binders: string[] = ['name', 'registernumber', 'supplierstatus.name', 'supplierstype.name','contactnumber', 'officetp'];

  cscolumns: string[] = ['csname', 'csregisternumber', 'cssupplierstatus', 'cssupplierstype', 'cscontactnumber', 'csofficetp'];
  csprompts: string[] = ['Search by Name', 'Search by R Number', 'Search by Status', 'Search by Type', 'Search by Category', 'Search by Office TP'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  supplier!: Supplier;
  oldsupplier!: Supplier;

  suppliers: Array<Supplier> = [];
  data!: MatTableDataSource<Supplier>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  supplierstatuses: Array<Supplierstatus> = [];
  suppliertypes: Array<Supplierstype> = [];
  categorys: Array<Category> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(
    private sus: SupplierService,
    private suss: Supplierstatusservice,
    private suts: Supplierstypeservice,
    private sucs: Categoryservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csname: new FormControl(),
      csregisternumber: new FormControl(),
      cssupplierstatus: new FormControl(),
      cssupplierstype: new FormControl(),
      cscontactnumber: new FormControl(),
      csofficetp: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssname: new FormControl(),
      ssregisternumber: new FormControl(),
      sscategory: new FormControl(),
    });

    this.form =this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "registernumber": new FormControl('', [Validators.required]),
      "doregister": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "officetp": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "contactperson": new FormControl('', [Validators.required]),
      "contactnumber": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "doenter": new FormControl('', [Validators.required]),
      "supplierstatus": new FormControl('', [Validators.required]),
      "supplierstype": new FormControl('', [Validators.required]),
      "category": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.suss.getAllList().then((vsts: Supplierstatus[]) => {
      this.supplierstatuses = vsts;
    });

    this.suts.getAllList().then((vtys: Supplierstype[]) => {
      this.suppliertypes = vtys;
    });

    this.sucs.getAllList().then((scos: Category[]) => {
      this.categorys = scos;
    });

    this.rs.get('supplier').then((regs: []) => {
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

    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['supplierstatus'].setValidators([Validators.required]);
    this.form.controls['supplierstype'].setValidators([Validators.required]);
    this.form.controls['doregister'].setValidators([Validators.required]);
    this.form.controls['category'].setValidators([Validators.required]);
    this.form.controls['registernumber'].setValidators([Validators.required, Validators.pattern(this.regexes['registernumber']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['officetp'].setValidators([Validators.required, Validators.pattern(this.regexes['officetp']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['contactperson'].setValidators([Validators.required, Validators.pattern(this.regexes['contactperson']['regex'])]);
    this.form.controls['contactnumber'].setValidators([Validators.required, Validators.pattern(this.regexes['contactnumber']['regex'])]);
    this.form.controls['doenter'].setValidators([Validators.required, Validators.pattern(this.regexes['doenter']['regex'])]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doregister" || controlName == "dateofregister")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldsupplier != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplier[controlName]) {
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

    this.sus.getAll(query)
      .then((supp: Supplier[]) => {
        this.suppliers = supp;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.suppliers);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (supplier: Supplier, filter: string) => {
      return (cserchdata.csname == null || supplier.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
        (cserchdata.csregisternumber == null || supplier.registernumber.toLowerCase().includes(cserchdata.csregisternumber.toLowerCase())) &&
        (cserchdata.cssupplierstatus == null || supplier.supplierstatus.name.toLowerCase().includes(cserchdata.cssupplierstatus.toLowerCase())) &&
        (cserchdata.cssupplierstype == null || supplier.supplierstype.name.toLowerCase().includes(cserchdata.cssupplierstype.toLowerCase())) &&
        (cserchdata.cscontactnumber == null || supplier.contactnumber.includes(cserchdata.cscontactnumber)) &&
        (cserchdata.csofficetp == null || supplier.officetp.includes(cserchdata.csofficetp));

    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssname;
    let registernumber = sserchdata.ssregisternumber;
    let categoryid = sserchdata.sscategory;


    let query = "";

    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (registernumber != null) query = query + "&registernumber=" + registernumber;
    if (categoryid != null) query = query + "&categoryid=" + categoryid;

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

  fillForm(supplier: Supplier) {

    this.enableButtons(false,true,true);

    this.selectedrow=supplier;

    this.supplier = JSON.parse(JSON.stringify(supplier));
    this.oldsupplier = JSON.parse(JSON.stringify(supplier));

    //@ts-ignore
    this.supplier.supplierstatus = this.supplierstatuses.find(s => s.id === this.supplier.supplierstatus.id);
    //@ts-ignore
    this.supplier.suppliertype = this.suppliertypes.find(t => t.id === this.supplier.suppliertype.id);
    //@ts-ignore
    this.supplier.supplies.category = this.categorys.find(t => t.id === this.supplier.supplies.categorys.id);

    this.form.patchValue(this.supplier);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.supplier = this.form.getRawValue();

      let supdata: string = "";

      supdata = supdata + "<br>Name is : " + this.supplier.name;
      supdata = supdata + "<br>Negister Number is : " + this.supplier.registernumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Add",
          message: "Are you sure to Add the following Supplier? <br> <br>" + supdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.sus.add(this.supplier).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Supplier Add", message: addmessage}
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
        data: {heading: "Errors - Supplier Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.supplier = this.form.getRawValue();
            this.supplier.id = this.oldsupplier.id;

            // @ts-ignore
            this.vs.update(this.supplier).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Supplier Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Supplier Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>" + this.supplier.registernumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sus.delete(this.supplier.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Supplier Delete ", message: delmessage}
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
        heading: "Confirmation - Supplier Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

}
