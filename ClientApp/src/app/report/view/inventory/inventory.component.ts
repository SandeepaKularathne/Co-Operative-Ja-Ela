import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByValuation } from '../../entity/countByValuation';
import {MatTableDataSource} from "@angular/material/table";

declare var google: any;

@Component({
  selector: 'app-countByValuation',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  countByValuations!: CountByValuation[];
  data!: MatTableDataSource<CountByValuation>;

  columns: string[] = ['countByValuation', 'count', 'percentage'];
  headers: string[] = ['CountByValuation', 'Count', 'Percentage'];
  binders: string[] = ['countByValuation', 'count', 'percentage'];

  @ViewChild('barchart', { static: false }) barchart: any;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.valuation()
      .then((des: CountByValuation[]) => {
        this.countByValuations = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countByValuations);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {
    const barData = new google.visualization.DataTable();

    // Define data types for columns
    barData.addColumn('string', 'CountByValuation'); // X-axis
    barData.addColumn('number', 'Count');           // Y-axis

    // Add rows to the DataTable
    this.countByValuations.forEach((des: CountByValuation) => {
      barData.addRow([des.name.toString(), des.count]);  // Ensure 'name' is string, 'count' is number
    });

    const barOptions = {
      title: '',
      height: 600,
      width: 1200,
      hAxis: { title: 'CountByValuation' },  // X-axis
      vAxis: { title: 'Count' },             // Y-axis
      bars: 'vertical',                      // Ensure bars are vertical
      isStacked: false
    };

    const barChart = new google.visualization.ColumnChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);
  }



}
