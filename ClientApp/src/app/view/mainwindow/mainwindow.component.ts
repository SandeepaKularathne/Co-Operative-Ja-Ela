import {Component,ElementRef} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import { WeatherService } from "../../service/weatherservice";
import {MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})

export class MainwindowComponent {

  opened: boolean = true;
  greetingMessage: string = '';
  currentTime: Date = new Date();
  weatherData: any;
  weatherConditions: string = '';
  weatherIcon: string = '';
  currentRoute: string = '';
  showNames: boolean = true;
  toggleable :number = 0;
  itemClickedState: any = {
    dashboard: true,
    admin: false,
    academic: false,
    registration: false,
    classes: false,
    report: false,
    vehicle: false
  };

  constructor(private activeRoute :ActivatedRoute,private router: Router,public authService: AuthorizationManager,private weatherService: WeatherService, private elementRef: ElementRef) {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = this.capitalizeFirstLetter(this.router.url.split('/')[this.router.url.split('/').length - 1]);
        }
      }
    );
  }

  ngOnInit(): void {
    this.setGreetingMessage();
    setInterval(() => { this.currentTime = new Date();}, 1000);
    this.getWeatherData(7.087310, 80.014366);
    const clickedItem = localStorage.getItem('clickedItem');
    if (clickedItem) {
      this.itemClickedState[clickedItem] = true;
      this.itemClickedState["dashboard"] = false;
    }
  }

  toggleMenu() {
    this.showNames = !this.showNames;
    this.toggleable = this.toggleable === 0 ? 1 : 0;
  }
  toggleShowNav(entering: boolean) { if(this.toggleable === 1){ this.showNames = !this.showNames; }}

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getWeatherData(latitude: number, longitude: number): void {
    this.weatherService.getWeatherForecast(latitude, longitude)
      .subscribe(data => {
        this.weatherData = data;
        this.calculateWeatherConditions();
      });
  }

  calculateWeatherConditions(): void {
    if (this.weatherData && this.weatherData.current) {
      const temperature = this.weatherData.current.temperature_2m;
      const windSpeed = this.weatherData.current.wind_speed_10m;

      if (temperature > 25 && windSpeed < 5) {
        this.weatherConditions = 'Sunny Day';
        this.weatherIcon = 'wb_sunny';
      } else if (temperature < 10 || windSpeed > 10) {
        this.weatherConditions = 'Rainy and Cloudy Day';
        this.weatherIcon = 'cloud';
      } else {
        this.weatherConditions = 'Moderate Weather';
        this.weatherIcon = 'wb_cloudy';
      }
    }
  }

  setGreetingMessage(): void {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = 'Good Afternoon!';
    } else {
      this.greetingMessage = 'Good Evening!';
    }
  }


  logout(): void {
    this.router.navigateByUrl("login")
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
    localStorage.removeItem('clickedItem');
  }

  admMenuItems = this.authService.admMenuItems;
  acdMenuItems = this.authService.acdMenuItems;
  regMenuItems = this.authService.regMenuItems;
  clsMenuItems = this.authService.clsMenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        return this.admMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Academic':
        return this.acdMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Registration':
        return this.regMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Class':
        return this.clsMenuItems.some(menuItem => menuItem.accessFlag);
      default:
        return false;
    }
  }

  logItemId(id: string) {
    for (const key in this.itemClickedState) {
      if (Object.prototype.hasOwnProperty.call(this.itemClickedState, key)) {
        this.itemClickedState[key] = false;
      }
    }
    this.itemClickedState[id] = true;
    localStorage.setItem('clickedItem', id);
  }


}
