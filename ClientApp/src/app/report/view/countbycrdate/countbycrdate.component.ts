import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import {MatTableDataSource} from "@angular/material/table";
import { CountByCRDate } from '../../entity/countbycrdate';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

declare var google: any;

@Component({
  selector: 'app-crdate',
  templateUrl: './countbycrdate.component.html',
  styleUrls: ['./countbycrdate.component.css']
})
export class CountByCRDateComponent implements OnInit {

  countbycrdate!: CountByCRDate[];
  data!: MatTableDataSource<CountByCRDate>;

  columns: string[] = ['year', 'month', 'gender', "totalcount"];
  headers: string[] = ['Year', 'Month', 'Gender', 'Total Count'];
  binders: string[] = ['year', 'month', 'gender','tcount'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {
    this.loadData(new Date().getFullYear());
  }

  loadData(year:number){
    let query = "";
    query = query + "?year=" + year;

    this.rs.countByCRDate(query)
      .then((des: CountByCRDate[]) => {
        this.countbycrdate = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });
  }
  loadTable() : void{
    this.data = new MatTableDataSource(this.countbycrdate);
  }

  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {
    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Month');
    barData.addColumn('number', 'Male');
    barData.addColumn('number', 'Female');
    barData.addColumn('number', 'Other');

    // Initialize the map with months and gender counts
    const monthGenderCountMap: { [key: string]: { male: number; female: number; other: number; } } = {};

    this.countbycrdate.forEach((des: CountByCRDate) => {
      const month = `${des.year}-${des.month}`;
      if (!monthGenderCountMap[month]) {
        monthGenderCountMap[month] = { male: 0, female: 0 , other: 0};
      }
      if (des.gender.toLowerCase().trim() === 'male') {
        monthGenderCountMap[month].male += des.tcount;
      }else if (des.gender.toLowerCase().trim() === 'female'){
        monthGenderCountMap[month].female += des.tcount
      }else if (des.gender.toLowerCase().trim() === 'other'){
        monthGenderCountMap[month].other += des.tcount
      }

    });


    // Add rows to barData
    Object.keys(monthGenderCountMap).forEach(month => {
      const counts = monthGenderCountMap[month];
      barData.addRow([month, counts.male, counts.female, counts.other]);
    });

    const barOptions = {
      title: 'Yearly Customer Registration Counts by Gender',
      height: 500,
      width: 1200,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Count' },
      isStacked: false,
      bar: { groupWidth: '75%' },
      seriesType: 'bars',
    };

    const barChart = new google.visualization.ComboChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);
  }
  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  onYearChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    if (selectedDate) {
      let year = selectedDate.getFullYear();
      this.loadData(year);

    }
  }
}
