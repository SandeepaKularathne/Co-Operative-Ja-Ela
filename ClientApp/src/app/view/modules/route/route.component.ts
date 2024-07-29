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
import { Route } from 'src/app/entity/route';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Routeservice } from 'src/app/service/routeservice';
import {Grade} from "../../../entity/grade";
// @ts-ignore
import { GradeService } from "../../../service/gradeservice";

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})

export class RouteComponent {


  columns: string[] = ['routenumber', 'name', 'distance', 'Grade'];
  headers: string[] = ['Route Number', 'Name', 'Distance', 'Grade'];
  binders: string[] = ['routenumber', 'name', 'distance', 'grade.name'];

  cscolumns: string[] = ['csroutenumber', 'csname', 'csdistance', 'csgrade'];
  csprompts: string[] = ['Search by Route Number', 'Search by Name', 'Search by Distance', 'Search by Grade'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  route!: Route;
  oldroute!: Route;

  routes: Array<Route> = [];
  data!: MatTableDataSource<Route>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  grades: Array<Grade> = [];


  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private grds: GradeService,
    private rous: Routeservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csroutenumber: new FormControl(),
      csname: new FormControl(),
      csdistance: new FormControl(),
      csgrade: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssgrade: new FormControl(),
      ssroutenumber: new FormControl(),
    });

    this.form =this.fb.group({
      "routenumber": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "distance": new FormControl('', [Validators.required]),
      "grade": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.rous.getAll('').then((vsts: Route[]) => {
      this.routes = vsts;
    });

    this.grds.getAllList().then((vsts: Grade[]) => {
      this.grades = vsts;
    });

    this.rs.get('route').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['routenumber'].setValidators([Validators.required, Validators.pattern(this.regexes['routenumber']['regex'])]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['distance'].setValidators([Validators.required, Validators.pattern(this.regexes['distance']['regex'])]);
    this.form.controls['grade'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "opdate" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldroute != undefined && control.valid) {
            // @ts-ignore
            if (value === this.route[controlName]) {
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

    this.rous.getAll(query)
      .then((emps: Route[]) => {
        this.routes = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.routes);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (route: Route, filter: string) => {
      return (cserchdata.csroutenumber == null || route.routenumber.toLowerCase().includes(cserchdata.csroutenumber.toLowerCase())) &&
        (cserchdata.csname == null || route.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
        (cserchdata.csdistance == null || route.distance.toLowerCase().includes(cserchdata.csdistance.toLowerCase())) &&
        (cserchdata.csgrade== null || route.grade.name.toLowerCase().includes(cserchdata.csgrade.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let routenumber = sserchdata.ssroutenumber;
    let gradeid = sserchdata.ssgrade;

    let query = "";

    if (routenumber != null) query = query + "&routenumber=" + routenumber;
    if (gradeid != null) query = query + "&employeeid=" + gradeid;

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

  fillForm(route: Route) {

    this.enableButtons(false,true,true);

    this.selectedrow=route;

    this.route = JSON.parse(JSON.stringify(route));
    this.oldroute = JSON.parse(JSON.stringify(route));


    //@ts-ignore
    this.route.grade = this.grades.find(s => s.id === this.route.grade.id);

    this.form.patchValue(this.route);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Route Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.route = this.form.getRawValue();

      let shdata: string = "";

      shdata = shdata + "<br> Route Number is : " + this.route.routenumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Route Add",
          message: "Are you sure to Add the following Route? <br> <br>" + shdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.rous.add(this.route).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Route Add", message: addmessage}
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
            this.route = this.form.getRawValue();

            this.route.id = this.oldroute.id;

            this.rous.update(this.route).then((responce: [] | undefined) => {
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
        heading: "Confirmation - Route Delete",
        message: "Are you sure to Delete following Route? <br> <br>" + this.route.routenumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.rous.delete(this.route.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Route Delete ", message: delmessage}
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
        heading: "Confirmation - Route Clear",
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

}










