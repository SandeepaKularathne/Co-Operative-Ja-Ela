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
import { Vehicle } from 'src/app/entity/vehicle';
import { VehicleService } from 'src/app/service/vehicleservice';
import { Vehiclebrandservice } from 'src/app/service/vehiclebrandservice';
import { Vehiclestatusservice } from 'src/app/service/vehiclestatusservice';
import { Vehiclemodelservice } from 'src/app/service/vehiclemodelservice';
import { Vehicletypeservice } from 'src/app/service/vehicletypeservice';
import { Vehiclebrand } from 'src/app/entity/vehiclebrand';
import { Vehiclestatus } from 'src/app/entity/vehiclestatus';
import { Vehicletype } from 'src/app/entity/vehicletype';
import { Vehiclemodel } from 'src/app/entity/vehiclemodel';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})

export class VehicleComponent {


  columns: string[] = ['number', 'lastregdate', 'vehiclestatus', 'vehicletype','vehiclebrand', 'modi'];
  headers: string[] = ['Number', 'LR Date', 'Status', 'Type', 'Brand','Service Call'];
  binders: string[] = ['number', 'lastregdate', 'vehiclestatus.name', 'vehicletype.name','vehiclemodel.vehiclebrand.name', 'getModi()'];

  cscolumns: string[] = ['csnumber', 'cslastregdate', 'csvehiclestatus', 'csvehicletype', 'csvehiclebrand', 'csmodi'];
  csprompts: string[] = ['Search by Number', 'Search by LR Date', 'Search by Status', 'Search by Type', 'Search by Brand', 'Search by Service Call'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  vehicle!: Vehicle;
  oldvehicle!: Vehicle;

  vehicles: Array<Vehicle> = [];
  data!: MatTableDataSource<Vehicle>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  vehiclestatuses: Array<Vehiclestatus> = [];
  vehicletypes: Array<Vehicletype> = [];
  vehiclemodels: Array<Vehiclemodel> = [];
  vehiclebrands: Array<Vehiclebrand> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private vs: VehicleService,
    private bs: Vehiclebrandservice,
    private ms: Vehiclemodelservice,
    private ss: Vehiclestatusservice,
    private ts: Vehicletypeservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csnumber: new FormControl(),
      cslastregdate: new FormControl(),
      csvehiclestatus: new FormControl(),
      csvehicletype: new FormControl(),
      csvehiclebrand: new FormControl(),
      csmodi: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssnumber: new FormControl(),
      ssvehiclestatus: new FormControl(),
      ssvehicletype: new FormControl(),
      ssvehiclemodel: new FormControl(),
      ssvehiclebrand: new FormControl()
    });

    this.form =this.fb.group({
      "number": new FormControl('', [Validators.required]),
      "doattach": new FormControl('', [Validators.required]),
      "yom": new FormControl('', [Validators.required]),
      "capacity": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "poto": new FormControl('', [Validators.required]),
      "curentmeterreading": new FormControl('', [Validators.required]),
      "lastregdate": new FormControl('', [Validators.required]),
      "lastservicedate": new FormControl('', [Validators.required]),
      "vehiclestatus": new FormControl('', [Validators.required]),
      "vehicletype": new FormControl('', [Validators.required]),
      "vehiclemodel": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.ss.getAllList().then((vsts: Vehiclestatus[]) => {
      this.vehiclestatuses = vsts;
    });

    this.ts.getAllList().then((vtys: Vehicletype[]) => {
      this.vehicletypes = vtys;
    });

    this.ms.getAllList().then((vmos: Vehiclemodel[]) => {
      this.vehiclemodels = vmos;
    });

    this.bs.getAllList().then((vbrs: Vehiclebrand[]) => {
      this.vehiclebrands = vbrs;
    });

    this.rs.get('vehicle').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.form.controls['vehiclestatus'].setValidators([Validators.required]);
    this.form.controls['vehicletype'].setValidators([Validators.required]);
    this.form.controls['vehiclemodel'].setValidators([Validators.required]);
    this.form.controls['doattach'].setValidators([Validators.required]);
    this.form.controls['yom'].setValidators([Validators.required, Validators.pattern(this.regexes['yom']['regex'])]);
    this.form.controls['capacity'].setValidators([Validators.required, Validators.pattern(this.regexes['capacity']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['poto'].setValidators([Validators.required]);
    this.form.controls['curentmeterreading'].setValidators([Validators.required, Validators.pattern(this.regexes['curentmeterreading']['regex'])]);
    this.form.controls['lastregdate'].setValidators([Validators.required]);
    this.form.controls['lastservicedate'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doattach" || controlName == "dateofattach")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldvehicle != undefined && control.valid) {
            // @ts-ignore
            if (value === this.vehicle[controlName]) {
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
      .then((emps: Vehicle[]) => {
        this.vehicles = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.vehicles);
        this.data.paginator = this.paginator;
      });

  }

  getModi(element: Vehicle) {

    const currentDate = new Date();
    const dateObject = new Date(element.lastservicedate);
    const Difference = Math.floor((currentDate.getTime() - dateObject.getTime())/ (1000 * 3600 * 24));;
    if (Difference > 365 )
      return "Needed";
    else
      return "Not Needed";
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (vehicle: Vehicle, filter: string) => {
      return (cserchdata.csnumber == null || vehicle.number.toLowerCase().includes(cserchdata.csnumber.toLowerCase())) &&
        (cserchdata.cslastregdate == null || vehicle.lastregdate.toLowerCase().includes(cserchdata.cslastregdate.toLowerCase())) &&
        (cserchdata.csvehiclestatus == null || vehicle.vehiclestatus.name.toLowerCase().includes(cserchdata.csvehiclestatus.toLowerCase())) &&
        (cserchdata.csvehicletype == null || vehicle.vehicletype.name.toLowerCase().includes(cserchdata.csvehicletype.toLowerCase())) &&
        (cserchdata.csvehiclebrand == null || vehicle.vehiclemodel.vehiclebrand.name.toLowerCase().includes(cserchdata.csvehiclebrand.toLowerCase())) &&
        (cserchdata.csmodi == null || this.getModi(vehicle).toLowerCase().includes(cserchdata.csmodi.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let number = sserchdata.ssnumber;
    let vehiclestatusid = sserchdata.ssvehiclestatus;
    let vehicletypeid = sserchdata.ssvehicletype;
    let vehiclemodelid = sserchdata.ssvehiclemodel;
    let vehiclebrandid = sserchdata.ssvehiclebrand;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&number=" + number;
    if (vehiclestatusid != null) query = query + "&vehiclestatusid=" + vehiclestatusid;
    if (vehicletypeid != null) query = query + "&vehiclestatusid=" + vehicletypeid;
    if (vehiclemodelid != null) query = query + "&vehiclestatusid=" + vehiclemodelid;
    if (vehiclebrandid != null) query = query + "&vehiclebrandid=" + vehiclebrandid;

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

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.form.controls['poto'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.form.controls['poto'].setErrors({'required': true});
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

  fillForm(vehicle: Vehicle) {

    this.enableButtons(false,true,true);

    this.selectedrow=vehicle;

    this.vehicle = JSON.parse(JSON.stringify(vehicle));
    console.log(this.vehiclemodels);
    this.oldvehicle = JSON.parse(JSON.stringify(vehicle));

    if (this.vehicle.poto != null) {
      this.imageempurl = atob(this.vehicle.poto);
      this.form.controls['poto'].clearValidators();
    } else {
      this.clearImage();
    }
    this.vehicle.poto = "";


    //@ts-ignore
    this.vehicle.vehiclestatus = this.vehiclestatuses.find(s => s.id === this.vehicle.vehiclestatus.id);
    //@ts-ignore
    this.vehicle.vehicletype = this.vehicletypes.find(t => t.id === this.vehicle.vehicletype.id);
    //@ts-ignore
    this.vehicle.vehiclemodel = this.vehiclemodels.find(m => m.id === this.vehicle.vehiclemodel.id);



    this.form.patchValue(this.vehicle);
    this.form.markAsPristine();

  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Vehicle Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.vehicle = this.form.getRawValue();
      this.vehicle.poto = btoa(this.imageempurl);

      let vehdata: string = "";

      vehdata = vehdata + "<br>Number is : " + this.vehicle.number;
      vehdata = vehdata + "<br>Year Of Made is : " + this.vehicle.yom;
      vehdata = vehdata + "<br>Capacity is : " + this.vehicle.capacity;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Vehicle Add",
          message: "Are you sure to Add the following Vehicle? <br> <br>" + vehdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.vs.add(this.vehicle).then((responce: [] | undefined) => {
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
              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Vehicle Add", message: addmessage}
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
        data: {heading: "Errors - Vehicle Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Vehicle Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.vehicle = this.form.getRawValue();
            if (this.form.controls['poto'].dirty) this.vehicle.poto = btoa(this.imageempurl);
            else this.vehicle.poto = this.oldvehicle.poto;
            this.vehicle.id = this.oldvehicle.id;

            this.vs.update(this.vehicle).then((responce: [] | undefined) => {
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
                this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Vehicle Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Vehicle Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Vehicle Delete",
        message: "Are you sure to Delete following Vehicle? <br> <br>" + this.vehicle.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.vs.delete(this.vehicle.id).then((responce: [] | undefined) => {

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
            this.clearImage();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Vehicle Delete ", message: delmessage}
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
        heading: "Confirmation - Vehicle Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }



}










