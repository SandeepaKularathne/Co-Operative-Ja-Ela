import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { MatTableDataSource } from "@angular/material/table";
import { CountByCRDate } from '../../entity/countbycrdate';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CountByIncomeShop } from "../../entity/countbyincomeshop";
import {Shopservice} from "../../../service/shopservice";
import {Shop} from "../../../entity/shop";
import {Category} from "../../../entity/category";

declare var google: any;

@Component({
  selector: 'app-crdate',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  countbycrdate!: CountByCRDate[];
  shopIncome!: CountByIncomeShop[];
  data!: MatTableDataSource<CountByCRDate>;
  shops: Array<Shop> = []

  columns: string[] = ['year', 'month', 'gender', "totalcount"];
  headers: string[] = ['Year', 'Month', 'Gender', 'Total Count'];
  binders: string[] = ['year', 'month', 'gender', 'tcount'];

  @ViewChild('genderbarchart', { static: false }) genderbarchart: any;
  @ViewChild('shopbarchart', { static: false }) shopbarchart: any;

  today = new Date();

  constructor(
    private rs: ReportService,
    private shps: Shopservice) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {
    this.initialize();
    this.loadGenderBarData(this.today.getFullYear());
    this.loadShopBarData(this.today.getFullYear(), '111');
  }

  initialize(){

    this.shps.getAll("").then((shps : Shop[])  =>{
      this.shops = shps
    });

  }

  loadGenderBarData(year: number) {
    let query = "";
    query = query + "?year=" + year;
    this.rs.countByCRDate(query)
      .then((des: CountByCRDate[]) => {
        this.countbycrdate = des;
      }).finally(() => {
      this.loadGenderBarChart();
    });
  }

  loadShopBarData(year:number, shopNumber:string) {
    let query =""
    query = query + "?year=" + year +"&shopNumber="+ shopNumber;
    this.rs.countByIncomeShop(query)
      .then((shp: CountByIncomeShop[]) => {
        this.shopIncome = shp;
      }).finally(() => {
      this.loadTable();
      this.loadShopBarChart();
    });
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.countbycrdate);
  }

  loadGenderBarChart(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawGenderBarChart.bind(this));
  }

  loadShopBarChart(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawShopBarChart.bind(this));
  }

  drawGenderBarChart() {
    const genderbarData = new google.visualization.DataTable();
    genderbarData.addColumn('string', 'Month');
    genderbarData.addColumn('number', 'Male');
    genderbarData.addColumn('number', 'Female');
    genderbarData.addColumn('number', 'Other');

    const monthGenderCountMap: { [key: string]: { male: number; female: number; other: number; } } = {};

    this.countbycrdate.forEach((des: CountByCRDate) => {
      const month = `${des.year}-${des.month}`;
      if (!monthGenderCountMap[month]) {
        monthGenderCountMap[month] = { male: 0, female: 0, other: 0 };
      }
      if (des.gender.toLowerCase().trim() === 'male') {
        monthGenderCountMap[month].male += des.tcount;
      } else if (des.gender.toLowerCase().trim() === 'female') {
        monthGenderCountMap[month].female += des.tcount;
      } else if (des.gender.toLowerCase().trim() === 'other') {
        monthGenderCountMap[month].other += des.tcount;
      }
    });

    Object.keys(monthGenderCountMap).forEach(month => {
      const counts = monthGenderCountMap[month];
      genderbarData.addRow([month, counts.male, counts.female, counts.other]);
    });

    const genderbarOptions = {
      title: '',
      height: 500,
      width: 1200,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Count' },
      isStacked: false,
      bar: { groupWidth: '75%' },
      seriesType: 'bars',
    };

    const genderbarchart = new google.visualization.ComboChart(this.genderbarchart.nativeElement);
    genderbarchart.draw(genderbarData, genderbarOptions);
  }

  drawShopBarChart() {
    const shopbarData = new google.visualization.DataTable();
    shopbarData.addColumn('string', 'Month');
    shopbarData.addColumn('number', 'Count');
    this.shopIncome.forEach((shp: CountByIncomeShop) => {
      shopbarData.addRow([shp.month.toString(), shp.tcount]);
    });

    const shopbarOptions = {
      title: 'Shop Income by Month',
      height: 500,
      width: 1200,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Count' },
      isStacked: false,
      bar: { groupWidth: '75%' },
      seriesType: 'bars',
    };

    const shopbarchart = new google.visualization.ComboChart(this.shopbarchart.nativeElement);
    shopbarchart.draw(shopbarData, shopbarOptions);
  }

  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  onYearChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    if (selectedDate) {
      let year = selectedDate.getFullYear();
      this.loadGenderBarData(year);
    }
  }

  shopYear: number = 0;
  selectedShopNumber: string ="";

  onShopYearChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    if (selectedDate) {
      this.shopYear = selectedDate.getFullYear();
      console.log(this.shopYear);
    }
  }


  onShopSelectionChange(shopNumber: string): void {
    this.selectedShopNumber = shopNumber;
    console.log(this.selectedShopNumber);
  }

  getShopNumber(): void {
    console.log(this.selectedShopNumber);
    this.loadShopBarData(this.shopYear, this.selectedShopNumber);
  }
}
