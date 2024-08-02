import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByPostatus } from '../../entity/countbypostatus';
import {CountByCategory} from "../../entity/countbycategory";
import {Shipping} from "../../entity/shipping";
import {Countbyitem} from "../../entity/countbyitem";
import {SupplierService} from "../../../service/supplierservice";
import {Supplier} from "../../../entity/supplier";
import {Route} from "../../../entity/route";


declare var google: any;

@Component({
  selector: 'app-postatus',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  countbypostatuss!: CountByPostatus[];
  countbycategory!: CountByCategory[];
  countbyitem!: Countbyitem[];
  suppliers: Array<Supplier> =[];


  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService, private sups: SupplierService) {

  }

  ngOnInit(): void {

    this.rs.countByPostatus()
      .then((des: CountByPostatus[]) => {
        this.countbypostatuss = des;
        }).finally(() => {
      this.loadCharts();
    });

    this.rs.countByCategory()
      .then((des: CountByCategory[]) => {
        this.countbycategory = des;
      }).finally(() => {
      this.loadCharts();
    });

    this.sups.getAll("").then((shps : Supplier[])  =>{
      this.suppliers = shps
    });

    this.loadRouteData(1);

  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'item');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Postatus');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'disstatus');
    lineData.addColumn('number', 'Count');

    this.countbypostatuss.forEach((des: CountByPostatus) => {
      pieData.addRow([des.postatus, des.count]);
    });

    this.countbyitem.forEach((des: Countbyitem) => {
      barData.addRow([des.item, des.count]);
    });

    this.countbycategory.forEach((des: CountByCategory) => {
      lineData.addRow([des.disstatus, des.count]);
    });

    const barOptions = {
      title: '',
      subtitle: 'Count of Employees by Postatus',
      bars: 'horizontal',
      height: 400,
      width: 1100
    };

    const pieOptions = {
      title:'',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: '',
      height: 400,
      width: 550
    };

    const barChart = new google.visualization.ColumnChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.BarChart(this.piechart.nativeElement);
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

    this.rs.countbyitem(query)
      .then((des: Countbyitem[]) => {
        this.countbyitem = des;
      }).finally(() => {
      this.loadCharts();
    });
  }
}
