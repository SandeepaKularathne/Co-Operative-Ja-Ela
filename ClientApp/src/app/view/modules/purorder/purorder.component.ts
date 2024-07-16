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

@Component({
  selector: 'app-purorder',
  templateUrl: './purorder.component.html',
  styleUrls: ['./purorder.component.css']
})

export class PurorderComponent {


  columns: string[] = ['ponumber', 'employee', 'postatus', 'date','qty','item'];
  headers: string[] = ['Ponumber', 'Employee', 'Status', 'Date','QTY', 'Item'];
  binders: string[] = ['ponumber', 'employee.fullname', 'postatus.name', 'date','poitems','poitems'];

  cscolumns: string[] = ['csponumber', 'csemployee', 'cspostatus', 'csdate','csqty', 'csitem'];
  csprompts: string[] = ['Search by Ponumber', 'Search by Employee', 'Search by Status', 'Search by Date','Search by QTY', 'Search by Item'];

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
  items: Array<Item> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;
  

  constructor(
    private vs: PurorderService,
    private ss: Postatusservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csponumber: new FormControl(),
      csemployee: new FormControl(),
      cspostatus: new FormControl(),
      csdate: new FormControl(),
      csqty: new FormControl(),
      csitem: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssponumber: new FormControl(),
      sspostatus: new FormControl(),
    });

    this.form =this.fb.group({
      "ponumber": new FormControl('', [Validators.required]),
      "date": new FormControl('', [Validators.required]),
      "expectedcost": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "postatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
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

    this.ss.getAllList().then((vsts: Postatus[]) => {
      this.postatuses = vsts;
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

    this.form.controls['ponumber'].setValidators([Validators.required, Validators.pattern(this.regexes['ponumber']['regex'])]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['expectedcost'].setValidators([Validators.required, Validators.pattern(this.regexes['expectedcost']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['postatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['item'].setValidators([Validators.required]);
    this.form.controls['qty'].setValidators([Validators.required]);
    this.form.controls['explinetotal'].setValidators([Validators.required, Validators.pattern(this.regexes['expectedcost']['regex'])]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

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

    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  loadTable(query: string) {

    this.vs.getAll(query)
      .then((emps: Purorder[]) => {
        this.purorders = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purorders);
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
        //(cserchdata.csqty == null || purorder.poitem.qty.toLowerCase().includes(cserchdata.csqty.toLowerCase())) &&
        //(cserchdata.csitem== null || purorder.poitem.item.name.toLowerCase().includes(cserchdata.csitem.toLowerCase()))&&
        (cserchdata.csdate== null || purorder.date.includes(cserchdata.csitem.toLowerCase()));
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

    this.enableButtons(false,true,true);

    this.selectedrow=purorder;

    this.purorder = JSON.parse(JSON.stringify(purorder));
    this.oldpurorder = JSON.parse(JSON.stringify(purorder));



    //@ts-ignore
    this.purorder.postatus = this.postatuses.find(s => s.id === this.purorder.postatus.id);
    //@ts-ignore
    //this.purorder.purordertype = this.purordertypes.find(t => t.id === this.purorder.purordertype.id);
    //@ts-ignore
    //this.purorder.purordermodel = this.purordermodels.find(m => m.id === this.purorder.purordermodel.id);



    this.form.patchValue(this.purorder);
    this.form.markAsPristine();

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
          this.vs.add(this.purorder).then((responce: [] | undefined) => {
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
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

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

            this.purorder.id = this.oldpurorder.id;

            this.vs.update(this.purorder).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Purorder Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Purorder Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Purorder Delete",
        message: "Are you sure to Delete following Purorder? <br> <br>" + this.purorder.ponumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.vs.delete(this.purorder.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Purorder Delete ", message: delmessage}
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
        heading: "Confirmation - Purorder Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
    this.enableButtons(true,false,false);
  }

}










