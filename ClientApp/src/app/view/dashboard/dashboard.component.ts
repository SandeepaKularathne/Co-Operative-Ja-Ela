import {Component} from '@angular/core';
import { Vehicle } from 'src/app/entity/vehicle';
import { VehicleService } from 'src/app/service/vehicleservice';
import { SupplierService } from 'src/app/service/supplierservice';
import { Supplier } from 'src/app/entity/supplier';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  vehicles: Vehicle[] = [];
  suppliers: Supplier[] = [];
  employees: Employee[] = [];
  vCount: number = 0;
  supCount: number = 0;
  empCount: number = 0;

  constructor(private vs: VehicleService, private ss: SupplierService,private es: EmployeeService) {}

  generalmessages: any[] = [
    {icon:'info', name:'General Inquiries:' , to:'info@cooperativejaela.lk', for: 'Requests for information about services or products'},
    {icon:'headset_mic', name:'Customer Support:' , to:'support@cooperativejaela.lk' , for: 'Customer service requests and issues'},
    {icon:'shopping_cart', name:'Sales:' , to:'sales@cooperativejaela.lk', for: 'Pricing and quotations, Bulk orders, Sales inquiries'},
    {icon:'contact_mail', name:'Contact:' , to:'contact@cooperativejaela.lk', for: 'General contact for various departments', tel:'Tel: 0112248745'},
    {icon:'admin_panel_settings', name:'Admin:' , to:'admin@cooperativejaela.lk', for: 'Legal and compliance issues, Website or email administration issues'}
  ];


  ngOnInit(): void {
    this.fetchVehicles();
    this.fetchsuppliers();
    this.fetchemployees();
  }

  fetchVehicles(): void {
    this.vs.getAll('').then(
      (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
        this.vehicleCount();
      },
      (error: any) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  fetchsuppliers(): void {
    this.ss.getAll('').then(
      (suppliers: Supplier[]) => {
        this.suppliers = suppliers;
        this.supplierCount();
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  fetchemployees(): void {
    this.es.getAll('').then(
      (employees: Employee[]) => {
        this.employees = employees;
        this.employeeCount();
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  vehicleCount(): void {
    const currentDate = new Date();
    let count: number = 0;

    this.vehicles.forEach(vehicle => {
      const dateObject = new Date(vehicle.lastservicedate);
      const differenceInDays = Math.floor((currentDate.getTime() - dateObject.getTime()) / (1000 * 3600 * 24));
      if (vehicle.vehiclestatus.name == "Free" && differenceInDays < 365) {
        count += 1;
      }
    });
    this.vCount = count;
  }

  employeeCount(): void {
    let count: number = 0;

    this.employees.forEach(vehicle => {
      count = count+1
    });
    this.empCount = count;
  }

  supplierCount(): void {
    let count: number = 0;

    this.suppliers.forEach(vehicle => {
      count = count+1
    });
    this.supCount = count;
  }
  
}
