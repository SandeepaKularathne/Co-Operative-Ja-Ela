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
import {Customer} from "../../../entity/customer";
import {Customerservice} from "../../../service/customerservice";
import { Gender } from '../../../entity/gender';
import { Loyaltyprogram } from '../../../entity/loyaltyprogram';
import {Loyaltyprogramservice} from "../../../service/loyaltyprogramservice";
import {GenderService} from "../../../service/genderservice";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent {


  columns: string[] = ['phonenumber', 'name', 'birthday', 'city','loyaltyprogram', 'gender'];
  headers: string[] = ['Phone Number', 'Name', 'Birthday', 'City', 'Level','Gender'];
  binders: string[] = ['phonenumber', 'name', 'birthday', 'city','loyaltyprogram.level', 'gender.name'];

  cscolumns: string[] = ['csphonenumber', 'csname', 'csbirthday', 'cscity', 'csloyaltyprogram', 'csgender'];
  csprompts: string[] = ['Search by Phone Number', 'Search by Name', 'Search by Birthday', 'Search by City', 'Search by Level', 'Search by Gender'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  customer!: Customer;
  oldcustomer!: Customer;

  customers: Array<Customer> = [];
  data!: MatTableDataSource<Customer>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  loyaltyprograms: Array<Loyaltyprogram> = [];
  genders: Array<Gender> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private cuss: Customerservice,
    private lops: Loyaltyprogramservice,
    private gens: GenderService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csphonenumber: new FormControl(),
      csname: new FormControl(),
      csbirthday: new FormControl(),
      cscity: new FormControl(),
      csloyaltyprogram: new FormControl(),
      csgender: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssphonenumber: new FormControl(),
      ssloyaltyprogram: new FormControl(),
      ssgender: new FormControl(),
    });

    this.form =this.fb.group({
      "phonenumber": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "birthday": new FormControl('', [Validators.required]),
      "city": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "loyaltyprogram": new FormControl('', [Validators.required]),
      "gender": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.lops.getAllList().then((vsts: Loyaltyprogram[]) => {
      this.loyaltyprograms = vsts;
    });

    this.gens.getAllList().then((vsts: Gender[]) => {
      this.genders = vsts;
    });

    this.rs.get('customer').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['phonenumber'].setValidators([Validators.required, Validators.pattern(this.regexes['phonenumber']['regex'])]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['birthday'].setValidators([Validators.required]);
    this.form.controls['city'].setValidators([Validators.required, Validators.pattern(this.regexes['city']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['loyaltyprogram'].setValidators([Validators.required]);
    this.form.controls['gender'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "birthday" || controlName == "birthday")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldcustomer != undefined && control.valid) {
            // @ts-ignore
            if (value === this.customer[controlName]) {
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

    this.cuss.getAll(query)
      .then((emps: Customer[]) => {
        this.customers = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.customers);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (customer: Customer, filter: string) => {
      return (cserchdata.csphonenumber == null || customer.phonenumber.toLowerCase().includes(cserchdata.csphonenumber.toLowerCase())) &&
        (cserchdata.csname == null || customer.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
        (cserchdata.csbirthday == null || customer.birthday.toLowerCase().includes(cserchdata.csbirthday.toLowerCase())) &&
        (cserchdata.csloyaltyprogram== null || customer.loyaltyprogram.level.toLowerCase().includes(cserchdata.csloyaltyprogram.toLowerCase())) &&
        (cserchdata.csgender== null || customer.gender.name.toLowerCase().includes(cserchdata.csgender.toLowerCase())) &&
        (cserchdata.cscity == null || customer.city.toLowerCase().includes(cserchdata.cscity.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let genderid= sserchdata.ssgender;
    let loyaltyprogramid = sserchdata.ssloyaltyprogram;
    let phonenumber = sserchdata.ssphonenumber;

    let query = "";

    if (genderid != null) query = query + "&genderid=" + genderid;
    if (loyaltyprogramid != null) query = query + "&loyaltyprogramid=" + loyaltyprogramid;
    if (phonenumber != null && phonenumber.trim() != "") query = query + "&phonenumber=" + phonenumber;

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

  fillForm(customer: Customer) {

    this.enableButtons(false,true,true);

    this.selectedrow=customer;

    this.customer = JSON.parse(JSON.stringify(customer));
    this.oldcustomer = JSON.parse(JSON.stringify(customer));

    //@ts-ignore
    this.customer.gender = this.genders.find(s => s.id === this.customer.gender.id);

    //@ts-ignore
    this.customer.loyaltyprogram = this.loyaltyprograms.find(s => s.id === this.customer.loyaltyprogram.id);

    this.form.patchValue(this.customer);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Customer Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.customer = this.form.getRawValue();

      let shdata: string = "";

      shdata = shdata + "<br> Customer Number is : " + this.customer.phonenumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Customer Add",
          message: "Are you sure to Add the following Customer? <br> <br>" + shdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.cuss.add(this.customer).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Customer Add", message: addmessage}
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
            this.customer = this.form.getRawValue();

            this.customer.id = this.oldcustomer.id;

            this.cuss.update(this.customer).then((responce: [] | undefined) => {
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
        heading: "Confirmation - Customer Delete",
        message: "Are you sure to Delete following Customer? <br> <br>" + this.customer.phonenumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cuss.delete(this.customer.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Customer Delete ", message: delmessage}
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
        heading: "Confirmation - Customer Clear",
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










