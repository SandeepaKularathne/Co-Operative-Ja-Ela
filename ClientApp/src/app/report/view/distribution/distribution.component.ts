import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByVehiclestatus } from '../../entity/countbyvehiclestatus';
import {MatTableDataSource} from "@angular/material/table";
import {CountByShopstatus} from "../../entity/countbyshopstatus";
import {Shipping} from "../../entity/shipping";
import {Shop} from "../../../entity/shop";
import {Route} from "../../../entity/route";
import {Shopservice} from "../../../service/shopservice";
import {Routeservice} from "../../../service/routeservice";
import {CountByIncomeShop} from "../../entity/countbyincomeshop";
import {CountByDisstatus} from "../../entity/countbydisstatus";

declare var google: any;

@Component({
  selector: 'app-vehiclestatus',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css']
})
export class DistributionComponent implements OnInit {

  countbyvehiclestatuss!: CountByVehiclestatus[];
  countbyshopstatuss!: CountByShopstatus[];
  countbydisstatuss!: CountByDisstatus[];
  shipping!: Shipping[];
  data!: MatTableDataSource<Shipping>;
  routes: Array<Route> =[];


  columns: string[] = [ 'shopnumber', 'root','num'];
  headers: string[] = [ 'Shop Number', 'Route','Route Number'];
  binders: string[] = [ 'shopnumber', 'root', 'num'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService,private shps: Routeservice) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.countByVehiclestatus()
      .then((des: CountByVehiclestatus[]) => {
        this.countbyvehiclestatuss = des;
        }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countByShopstatus()
      .then((des: CountByShopstatus[]) => {
        this.countbyshopstatuss = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countByDisstatus()
      .then((des: CountByDisstatus[]) => {
        this.countbydisstatuss = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.shps.getAll("").then((shps : Route[])  =>{
      this.routes = shps
    });

    this.loadRouteData(1);

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.shipping);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Vehiclestatus');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Shopstatus');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Disstatus');
    lineData.addColumn('number', 'Count');

    this.countbyvehiclestatuss.forEach((des: CountByVehiclestatus) => {
      lineData.addRow([des.vehiclestatus, des.count]);

    });
    this.countbyshopstatuss.forEach((des: CountByShopstatus) => {
      pieData.addRow([des.shopstatus, des.count]);
    });
    this.countbydisstatuss.forEach((des: CountByDisstatus) => {
      barData.addRow([des.disstatus, des.count]);
    });

    const barOptions = {
      title: '',
      subtitle: '',
      bars: 'horizontal',
      height: 400,
      width: 550
    };

    const pieOptions = {
      title: '',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: '',
      height: 400,
      width: 1200
    };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
  }


  selectedNumber: number =0;

  onAnge(id: number): void {
    this.selectedNumber = id;
  }
  getNumber(): void {
    this.loadRouteData(this.selectedNumber);
  }

  loadRouteData(id: number) {
    let query = "";
    query = query + "?id=" + id;

    this.rs.shipping(query)
      .then((des: Shipping[]) => {
        this.shipping = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });
  }
}
