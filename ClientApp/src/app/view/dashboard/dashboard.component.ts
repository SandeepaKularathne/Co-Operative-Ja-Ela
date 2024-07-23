import {Component, ViewChild, ElementRef} from '@angular/core';
import { Vehicle } from 'src/app/entity/vehicle';
import { VehicleService } from 'src/app/service/vehicleservice';
import { Employee } from 'src/app/entity/employee';
import { EmployeeService } from 'src/app/service/employeeservice';
import { Customer } from 'src/app/entity/customer';
import { Customerservice } from 'src/app/service/customerservice';
import { ReportService } from 'src/app/report/reportservice';
import { Shopservice } from 'src/app/service/shopservice';
import { Shop } from 'src/app/entity/shop';

declare var google: any;


export interface DashRep {
  lower: number;
  upper: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  vehicles: Vehicle[] = [];
  shops: Shop[] = [];
  employees: Employee[] = [];
  customers: Customer[] = [];
  vCount: number = 0;
  shopCount: number = 0;
  empCount: number = 0;
  cusCount: number = 0;

  @ViewChild('piechart', { static: true }) piechart!: ElementRef;
  dashrep: Array<any> = [];
  private colorInterval: any;
  private currentColor: string = 'red';


  constructor(private vs: VehicleService, private sh: Shopservice,private es: EmployeeService,private cs: Customerservice, private rs: ReportService) {}

  generalmessages: any[] = [
    {icon:'info', name:'General Inquiries:' , to:'info@cooperativejaela.lk', for: 'Requests for information about services or products'},
    {icon:'headset_mic', name:'Customer Support:' , to:'support@cooperativejaela.lk' , for: 'Customer service requests and issues'},
    {icon:'shopping_cart', name:'Sales:' , to:'sales@cooperativejaela.lk', for: 'Pricing and quotations, Bulk orders, Sales inquiries'},
    {icon:'contact_mail', name:'Contact:' , to:'contact@cooperativejaela.lk', for: 'General contact for various departments', tel:'Tel: 0112248745'},
    {icon:'admin_panel_settings', name:'Admin:' , to:'admin@cooperativejaela.lk', for: 'Legal and compliance issues, Website or email administration issues'}
  ];


  ngOnInit(): void {
    this.fetchVehicles();
    this.fetchshops();
    this.fetchemployees();
    this.fetchCustomers();
    this.getreport();
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

  fetchshops(): void {
    this.sh.getAll('').then(
      (shops: Shop[]) => {
        this.shops = shops;
        this.shopCount = this.shops.length;
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
        this.empCount = this.employees.length;
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  getreport(): void {
    this.rs.dashrep()
      .then((des: any[]) => {
        this.dashrep = des;
      })
      .finally(() => {
        this.loadCharts();
      });
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

  fetchCustomers(): void {
    this.cs.getAll('').then(
      (customers: Customer[]) => {
        this.customers = customers;
        this.cusCount = this.customers.length;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  getSliceColor(): string {

    if (this.dashrep[0].lower > 35) {
      if (!this.colorInterval) {
        this.startColorInterval();
      }
      return this.currentColor;
    }
    return '#FFD700';

  }

  startColorInterval(): void {
    this.colorInterval = setInterval(() => {
      this.currentColor = this.currentColor === 'red' ? '#FFD700' : 'red';
      this.drawCharts(); // Redraw charts to update the color
    }, 500);
  }


  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }
  drawCharts(): void {
    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Range');
    pieData.addColumn('number', 'Value');

    this.dashrep.forEach((des: any) => {
      pieData.addRow(['Lower', des.lower]);
      pieData.addRow(['Upper', des.upper]);
    });

    const sliceColor = this.getSliceColor();

    const pieOptions = {
      slices: {
        0: { offset: 0.01, color:sliceColor },  // Customize slice color and offset this.dashrep.forEach(e->) < 0.65 ? 'red' :
        1: { color: '#005710' }  // Customize other slice colors
      },
      height: 400,  // Height in pixels
      width: 400,   // Width in pixels
      legend: { position: 'none' },   // Position the legend
      tooltip: { showColorCode: true } , // Show color code in tooltips
      chartArea: { left: 50, top: 0, width: '100%', height: '100%'},
      pieSliceText: 'label',
      pieSliceTextStyle: { fontSize: 23,fontName: 'Arial' }
    };

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);
  }


}
