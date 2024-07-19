import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {UserComponent} from "./view/modules/user/user.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
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
      {path:"reports", component: ArrearsByProgramComponent},
      {path:"payments",component:PaymentComponent},
      {path: "vehicle", component: VehicleComponent},
      {path: "dashboard/vehicle", component: VehicleComponent},
      {path: "supplier", component: SupplierComponent},
      {path: "dashboard/supplier", component: SupplierComponent},
      {path: "item", component: ItemComponent},
      {path: "purorder", component: PurorderComponent},
      {path: "grn", component: GrnComponent},
      {path: "store", component: StoreComponent},
      {path: "shop", component: ShopComponent},
      {path: "customer", component: CustomerComponent},
      {path: "dashboard/customer", component: CustomerComponent},
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
