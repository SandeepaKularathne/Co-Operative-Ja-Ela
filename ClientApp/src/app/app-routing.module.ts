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
import {AttendanceComponent} from "./view/modules/attendance/attendance.component";
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {StudentComponent} from "./view/modules/student/student.component";
import {BatchregistrationComponent} from "./view/modules/batchregistration/batchregistration.component";
import {ClassComponent} from "./view/modules/class/class.component";
import {BookdistributionComponent} from "./view/modules/bookdistribution/bookdistribution.component";
import {VehicleComponent} from "./view/modules/vehicle/vehicle.component";


const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path:"reports", component: ArrearsByProgramComponent},
      {path:"payments",component:PaymentComponent},
      {path: "dashboard/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path:"batchregistration",component:BatchregistrationComponent},
      {path: "dashboard/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path:"students",component:StudentComponent},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path:"class",component:ClassComponent},
      {path: "dashboard/class", redirectTo: 'class', pathMatch: 'full'},
      {path:"books",component:BookdistributionComponent},
      {path: "dashboard/books", redirectTo: 'books', pathMatch: 'full'},
      {path:"attendance",component:AttendanceComponent},
      {path: "dashboard/attendance", redirectTo: 'attendance', pathMatch: 'full'},
      {path: "vehicle", component: VehicleComponent},

    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
