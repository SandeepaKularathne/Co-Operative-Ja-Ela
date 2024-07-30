import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {EmployeeComponent} from './view/modules/employee/employee.component';
import {UserComponent} from './view/modules/user/user.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from "./service/employeeservice";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import { PrivilageComponent } from './view/modules/privilage/privilage.component';
import {AuthorizationManager} from "./service/authorizationmanager";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { OperationComponent } from './view/modules/operation/operation.component';
import { PaymentComponent } from './view/modules/payment/payment.component';
import {MatMenuModule} from "@angular/material/menu";
import {VehicleComponent} from "./view/modules/vehicle/vehicle.component";
import {SupplierComponent} from "./view/modules/supplier/supplier.component";
import {ItemComponent} from './view/modules/item/item.component';
import {PurorderComponent} from './view/modules/purorder/purorder.component';
import { JwtInterceptor } from './service/jwtInterceptor';
import {GrnComponent} from './view/modules/grn/grn.component';
import { StoreComponent } from './view/modules/store/store.component';
import { ShopComponent } from './view/modules/shop/shop.component';
import { CustomerComponent } from './view/modules/customer/customer.component';
import {CountByVehiclestatusComponent} from "./report/view/countbyvehiclestatus/countbyvehiclestatus.component";
import { CountByCRDateComponent } from './report/view/countbycrdate/countbycrdate.component';
import { DisrequestsComponent } from './view/modules/disrequests/disrequests.component';
import { InvoiceComponent } from './view/modules/invoice/invoice.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatalistComponent } from './util/mat-datalist/mat-datalist.component';
import { SupreturnComponent } from './view/modules/supreturn/supreturn.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {SupaymentComponent} from "./view/modules/supayment/supayment.component";
import {RouteComponent} from "./view/modules/route/route.component";
import {DisorderComponent} from "./view/modules/disorder/disorder.component";
import {DisreceiveComponent} from "./view/modules/disreceive/disreceive.component";
import {DepositsComponent} from "./view/modules/deposits/deposits.component";
import {StorereturnComponent} from "./view/modules/storereturn/storereturn.component";
import {CustomerreturnComponent} from "./view/modules/customerreturn/customerreturn.component";



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    MainwindowComponent,
    EmployeeComponent,
    UserComponent,
    ConfirmComponent,
    MessageComponent,
    PrivilageComponent,
    OperationComponent,
    PaymentComponent,
    VehicleComponent,
    SupplierComponent,
    ItemComponent,
    PurorderComponent,
    GrnComponent,
    StoreComponent,
    ShopComponent,
    CustomerComponent,
    CountByVehiclestatusComponent,
    CountByCRDateComponent,
    DisrequestsComponent,
    InvoiceComponent,
    MatDatalistComponent,
    SupreturnComponent,
    SupaymentComponent,
    RouteComponent,
    DisorderComponent,
    DisreceiveComponent,
    DepositsComponent,
    StorereturnComponent,
    CustomerreturnComponent,

  ],
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatIconModule,
        MatDialogModule,
        HttpClientModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        NgOptimizedImage,
        MatMenuModule,
        MatRadioModule,
        MatAutocompleteModule,


    ],
  providers: [
    OperationComponent,
    EmployeeService,
    DatePipe,
    AuthorizationManager,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
