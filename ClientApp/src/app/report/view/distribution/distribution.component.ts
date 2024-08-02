import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByVehiclestatus } from '../../entity/countbyvehiclestatus';
import {MatTableDataSource} from "@angular/material/table";
import {CountByShopstatus} from "../../entity/countbyshopstatus";

declare var google: any;

@Component({
  selector: 'app-vehiclestatus',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css']
})
export class DistributionComponent implements OnInit {

  countbyvehiclestatuss!: CountByVehiclestatus[];
  countbyshopstatuss!: CountByShopstatus[];
  data!: MatTableDataSource<CountByVehiclestatus>;
  sdata!: MatTableDataSource<CountByShopstatus>;

  columns: string[] = ['vehiclestatus', 'count', 'percentage'];
  headers: string[] = ['Vehiclestatus', 'Count', 'Percentage'];
  binders: string[] = ['vehiclestatus', 'count', 'percentage'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {
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

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbyvehiclestatuss);
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
    lineData.addColumn('string', 'Vehiclestatus');
    lineData.addColumn('number', 'Count');

    this.countbyvehiclestatuss.forEach((des: CountByVehiclestatus) => {
      barData.addRow([des.vehiclestatus, des.count]);
      lineData.addRow([des.vehiclestatus, des.count]);
    });
    this.countbyshopstatuss.forEach((des: CountByShopstatus) => {
      pieData.addRow([des.shopstatus, des.count]);
    });

    const barOptions = {
      title: 'Vehiclestatus Count (Bar Chart)',
      subtitle: 'Count of Employees by Vehiclestatus',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: '',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Vehiclestatus Count (Line Chart)',
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
}
