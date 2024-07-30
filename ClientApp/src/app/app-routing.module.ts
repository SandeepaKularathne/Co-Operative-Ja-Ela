import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {UserComponent} from "./view/modules/user/user.component";
import {CountByVehiclestatusComponent} from "./report/view/countbyvehiclestatus/countbyvehiclestatus.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {OperationComponent} from "./view/modules/operation/operation.component";
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {VehicleComponent} from "./view/modules/vehicle/vehicle.component";
import {SupplierComponent} from './view/modules/supplier/supplier.component';
import {ItemComponent} from './view/modules/item/item.component';
import { PurorderComponent } from './view/modules/purorder/purorder.component';
import { GrnComponent } from './view/modules/grn/grn.component';
import { StoreComponent } from './view/modules/store/store.component';
import { ShopComponent } from './view/modules/shop/shop.component';
import { CustomerComponent } from './view/modules/customer/customer.component';
import { CountByCRDateComponent } from './report/view/countbycrdate/countbycrdate.component';
import { DisrequestsComponent } from './view/modules/disrequests/disrequests.component';
import { InvoiceComponent } from './view/modules/invoice/invoice.component';
import { SupreturnComponent } from './view/modules/supreturn/supreturn.component';
import {SupaymentComponent} from "./view/modules/supayment/supayment.component";
import {RouteComponent} from "./view/modules/route/route.component";
import {DisorderComponent} from "./view/modules/disorder/disorder.component";
import {DisreceiveComponent} from "./view/modules/disreceive/disreceive.component";
import {DepositsComponent} from "./view/modules/deposits/deposits.component";
import {StorereturnComponent} from "./view/modules/storereturn/storereturn.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "dashboard/employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path:"payment",component:PaymentComponent},
      {path: "vehicle", component: VehicleComponent},
      {path: "dashboard/vehicle", component: VehicleComponent},
      {path: "supplier", component: SupplierComponent},
      {path: "dashboard/supplier", component: SupplierComponent},
      {path: "item", component: ItemComponent},
      {path: "dashboard/item", component: ItemComponent},
      {path: "purorder", component: PurorderComponent},
      {path: "dashboard/purorder", component: PurorderComponent},
      {path: "grn", component: GrnComponent},
      {path: "store", component: StoreComponent},
      {path: "shop", component: ShopComponent},
      {path: "dashboard/shop", component: ShopComponent},
      {path: "customer", component: CustomerComponent},
      {path: "dashboard/customer", component: CustomerComponent},
      {path: "countbyvehiclestatus", component: CountByVehiclestatusComponent},
      {path: "countbycrdate", component: CountByCRDateComponent},
      {path: "disrequests", component: DisrequestsComponent},
      {path: "invoice", component: InvoiceComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "operation", component: OperationComponent},
      {path: "supreturn", component: SupreturnComponent},
      {path: "supayment", component: SupaymentComponent},
      {path: "route", component: RouteComponent},
      {path: "disorder", component: DisorderComponent},
      {path: "disreceive", component: DisreceiveComponent},
      {path: "deposits", component: DepositsComponent},
      {path: "storereturn", component: StorereturnComponent}


    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
