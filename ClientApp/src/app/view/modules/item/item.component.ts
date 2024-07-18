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
import { Item } from 'src/app/entity/item';
import { ItemService } from 'src/app/service/itemservice';
import { Itembrandservice } from 'src/app/service/itembrandservice';
import { Itemstatusservice } from 'src/app/service/itemstatusservice';
import { Unittypeservice } from 'src/app/service/unittypeservice';
import { Itembrand } from 'src/app/entity/itembrand';
import { Itemstatus } from 'src/app/entity/itemstatus';
import { Unittype } from 'src/app/entity/unittype';
import { Category } from 'src/app/entity/category';
import { Categoryservice } from 'src/app/service/Categoryservice';
import { Supplier } from 'src/app/entity/supplier';
import { SupplierService } from 'src/app/service/supplierservice';
import { Subcategory } from 'src/app/entity/subcategory';
import { Subcategoryservice } from 'src/app/service/subcategoryservice';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent {


  columns: string[] = ['name', 'subcategory', 'itemstatus', 'unittype','itembrand', 'supplier'];
  headers: string[] = ['Name', 'Subcategory', 'Status', 'Type', 'Brand','Supplier'];
  binders: string[] = ['name', 'subcategory.name', 'itemstatus.name', 'unittype.name','itembrand.name', 'supplier.name'];

  cscolumns: string[] = ['csname', 'cssubcategory', 'csitemstatus', 'csunittype', 'csitembrand', 'cssupplier'];
  csprompts: string[] = ['Search by Name', 'Search by Subcategory', 'Search by Status', 'Search by Type', 'Search by Brand', 'Search by Supplier'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  item!: Item;
  olditem!: Item;

  items: Array<Item> = [];
  data!: MatTableDataSource<Item>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  itemstatuses: Array<Itemstatus> = [];
  unittypes: Array<Unittype> = [];
  itembrands: Array<Itembrand> = [];
  suppliers: Array<Supplier> = [];
  categorys: Array<Category> = [];
  subcategorys: Array<Subcategory> = [];

  enaadd:boolean = true;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private itms: ItemService,
    private itsus: SupplierService,
    private itbs: Itembrandservice,
    private itscs: Subcategoryservice,
    private itcs: Categoryservice,
    private itmss: Itemstatusservice,
    private itus: Unittypeservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      csname: new FormControl(),
      cssubcategory: new FormControl(),
      csitemstatus: new FormControl(),
      csunittype: new FormControl(),
      csitembrand: new FormControl(),
      cssupplier: new FormControl(),
    });

    this.ssearch = this.fb.group({
      ssname: new FormControl(),
      sscategory: new FormControl(),
      ssitemstatus: new FormControl(),
      ssunittype: new FormControl(),
      ssitembrand: new FormControl()
    });

    this.form =this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "sprice": new FormControl('', [Validators.required]),
      "pprice": new FormControl('', [Validators.required]),
      "poto": new FormControl(''),
      "quantity": new FormControl('', [Validators.required]),
      "rop": new FormControl('', [Validators.required]),
      "dointroduced": new FormControl('', [Validators.required]),
      "subcategory": new FormControl('', [Validators.required]),
      "itembrand": new FormControl('', [Validators.required]),
      "itemstatus": new FormControl('', [Validators.required]),
      "unittype": new FormControl('', [Validators.required]),
      "supplier": new FormControl('', [Validators.required]),
      "category": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.itmss.getAllList().then((vsts: Itemstatus[]) => {
      this.itemstatuses = vsts;
    });

    this.itus.getAllList().then((vtys: Unittype[]) => {
      this.unittypes = vtys;
    });

    this.itbs.getAllList().then((vbrs: Itembrand[]) => {
      this.itembrands = vbrs;
    });

    this.itsus.getAll('').then((vsys: Supplier[]) => {
      this.suppliers = vsys;
    });

    this.itcs.getAllList().then((csys: Category[]) => {
      this.categorys = csys;
    });

    this.itscs.getAllList().then((msys: Subcategory[]) => {
      this.subcategorys = msys;
    });

    this.rs.get('item').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['sprice'].setValidators([Validators.required, Validators.pattern(this.regexes['sprice']['regex'])]);
    this.form.controls['pprice'].setValidators([Validators.required, Validators.pattern(this.regexes['pprice']['regex'])]);
    this.form.controls['quantity'].setValidators([Validators.required, Validators.pattern(this.regexes['quantity']['regex'])]);
    this.form.controls['rop'].setValidators([Validators.required, Validators.pattern(this.regexes['rop']['regex'])]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['unittype'].setValidators([Validators.required]);
    this.form.controls['subcategory'].setValidators([Validators.required]);
    this.form.controls['itembrand'].setValidators([Validators.required]);
    this.form.controls['itemstatus'].setValidators([Validators.required]);
    this.form.controls['unittype'].setValidators([Validators.required]);
    this.form.controls['category'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doattach" || controlName == "dateofattach")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olditem != undefined && control.valid) {
            // @ts-ignore
            if (value === this.item[controlName]) {
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

    this.itms.getAll(query)
      .then((emps: Item[]) => {
        this.items = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.items);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (item: Item, filter: string) => {
      return (cserchdata.csname == null || item.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
        (cserchdata.cssubcategory == null || item.subcategory.name.toLowerCase().includes(cserchdata.cssubcategory.toLowerCase())) &&
        (cserchdata.csitemstatus == null || item.itemstatus.name.toLowerCase().includes(cserchdata.csitemstatus.toLowerCase())) &&
        (cserchdata.csunittype == null || item.unittype.name.toLowerCase().includes(cserchdata.csunittype.toLowerCase())) &&
        (cserchdata.csitembrand == null || item.itembrand.name.toLowerCase().includes(cserchdata.csitembrand.toLowerCase())) &&
        (cserchdata.cssupplier == null || item.supplier.name.toLowerCase().includes(cserchdata.cssupplier.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssname;
    let itemstatusid = sserchdata.ssitemstatus;
    let unittypeid = sserchdata.ssunittype;
    let categoryid = sserchdata.sscategory;
    let itembrandid = sserchdata.ssitembrand;

    let query = "";

    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (itemstatusid != null) query = query + "&itemstatusid=" + itemstatusid;
    if (unittypeid != null) query = query + "&itemstatusid=" + unittypeid;
    if (categoryid != null) query = query + "&categoryid=" + categoryid;
    if (itembrandid != null) query = query + "&itembrandid=" + itembrandid;

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

  fillForm(item: Item) {

    this.enableButtons(false,true,true);

    this.selectedrow=item;

    this.item = JSON.parse(JSON.stringify(item));

    this.olditem = JSON.parse(JSON.stringify(item));

    if (this.item.poto != null) {
      this.imageempurl = atob(this.item.poto);
      this.form.controls['poto'].clearValidators();
    } else {
      this.clearImage();
    }
    this.item.poto = "";



    //@ts-ignore
    this.item.itemstatus = this.itemstatuses.find(s => s.id === this.item.itemstatus.id);
    //@ts-ignore
    this.item.unittype = this.unittypes.find(t => t.id === this.item.unittype.id);
    //@ts-ignore
    this.item.category = this.categorys.find(m => m.id === this.item.subcategory.category.id);
    //@ts-ignore
    this.item.subcategory = this.subcategorys.find(m => m.id === this.item.subcategory.id);
    //@ts-ignore
    this.item.supplier = this.suppliers.find(m => m.id === this.item.supplier.id);
    //@ts-ignore
    this.item.itembrand = this.itembrands.find(m => m.id === this.item.itembrand.id);



    this.form.patchValue(this.item);
    this.form.markAsPristine();

  }

  add() {



    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - item Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.item = this.form.getRawValue();
      this.item.poto = btoa(this.imageempurl);
      delete this.form.controls['category'];

      let itmdata: string = "";

      itmdata = itmdata + "<br>Name is : " + this.item.name;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - item Add",
          message: "Are you sure to Add the following item? <br> <br>" + itmdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // @ts-ignore
          this.is.add(this.item).then((responce: [] | undefined) => {
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
              data: {heading: "Status -item Add", message: addmessage}
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
        data: {heading: "Errors - item Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - item Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.item = this.form.getRawValue();
            if (this.form.controls['poto'].dirty) this.item.poto = btoa(this.imageempurl);
            else this.item.poto = this.olditem.poto;
            this.item.id = this.olditem.id;

            this.itms.update(this.item).then((responce: [] | undefined) => {
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
                data: {heading: "Status -item Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - item Update", message: "Nothing Changed"}
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
        heading: "Confirmation - item Delete",
        message: "Are you sure to Delete following item? <br> <br>" + this.item.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.itms.delete(this.item.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - item Delete ", message: delmessage}
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
        heading: "Confirmation - item Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
        this.enableButtons(true,false,false);
        this.loadTable('');
      }
    });


  }

  filtersubcategory(){
    let category = this.form.controls['category'].value.id;
    this.itscs.getSubcategoryByCategory(category).then((msys: Subcategory[]) => {
      this.subcategorys = msys;
    });
  }

  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

}










