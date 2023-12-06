import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Country, State, City } from 'country-state-city';
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TrafficService } from 'src/app/services/traffic.service';

import { city as exCity, country } from './city';
export interface city {
  value: string;
  html: string;
}

export var continent = '';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() countries: any = [];
  @Input() cities: any = [];
  @Input() cityList: any = [];
  dropdownList = [];
  dropdownSettings: IDropdownSettings;

  // cityList: any = [];
  citieslist = [];

  countryList = country;

  selectedCountryList: string[] = [];
  selectedCityList: string[] = [];
  search_city: string;
  show_search: boolean = false;
  @Output() btnClick = new EventEmitter();
  public autoCompleteTags = [
    'America',
    'Central Europe',
    'Canada',
    'China',
    'Denmark',
    'USA',
    'Berlin',
    'Kiev',
    'London',
  ];

  constructor(private trafficService: TrafficService) {}

  ngOnInit(): void {
    // this.countries = Country.getAllCountries();
    // this.cities = City.getAllCities();
    // for (let i = 0; i < cities.length; i++) {
    //   citieslist.push(cities[i].name);
    // }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    /* Chart code */
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create('chartdiv', am4maps.MapChart); // Create map instance
    chart.geodata = am4geodata_worldLow; // Set map definition
    chart.projection = new am4maps.projections.Miller(); // Set projection

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries()); // Create map polygon series
    polygonSeries.exclude = ['AQ']; // Exclude Antartica
    polygonSeries.useGeodata = true; // Make map load polygon (like country names) data from GeoJSON

    //Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.polygon.fillOpacity = 0.6;

    // on polygon map click
    polygonTemplate.events.on('hit', (event) => {
      // country code id
      const datacontext = event.target.dataItem.dataContext;
      const country_id = datacontext['id'];
      const country_name = datacontext['name'];

      // set the hidden input
      $('#country_value').val(country_name);

      // zoom to specific map
      chart.zoomToMapObject(polygonSeries.getPolygonById(country_id));

      // hide the dropdown again and title
      $('#city_select').css('display', 'none');
      $('#continent_title').css('display', 'none');
      // empty the array
      this.cityList = [];

      this.GetCountryContinent(country_id);
      this.GetCountryCities(country_name);
    });

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create('hover');
    hs.properties.fill = chart.colors.getIndex(0);

    function createSeries(name, include, color, hoverColor) {
      let series = chart.series.push(new am4maps.MapPolygonSeries());
      series.name = name;
      series.useGeodata = true;
      series.include = include;
      series.fill = am4core.color(color);
      series.events.on('over', over);
      series.events.on('out', out);

      series.mapPolygons.template.tooltipText =
        '{series.name}: [bold]{name}[/]';
      series.mapPolygons.template.fill = am4core.color(color);

      let hover = series.mapPolygons.template.states.create('highlight');
      hover.properties.fill = am4core.color(hoverColor);

      return series;
    }

    // createSeries("Northern Europe", ["FI", "DK", "SE", "NO", "LT", "LV", "EE", "IS"], "#96BDC6", "#669DA6");
    // createSeries("Central Europe", ["AT", "CZ", "DE", "HU", "LI", "PL", "SK", "SI", "CH"], "#81968F", "#51665F");
    // createSeries("Eastern Europe", ["MD", "BY", "UA"], "#CFB9A5", "#AF9975");
    // createSeries("Southeast Europe", ["AL", "BA", "BG", "HR", "GR", "XK", "MK", "ME", "RO", "RS"], "#E8CCBF", "#C89C8F");

    // chart.legend = new am4maps.Legend();
    // chart.legend.position = "right";
    // chart.legend.scrollable = true;

    function over(ev) {
      ev.target.mapPolygons.each(function (polygon) {
        polygon.setState('highlight');
      });
    }

    function out(ev) {
      ev.target.mapPolygons.each(function (polygon) {
        polygon.setState('default');
      });
    }
    // hide the logo on the map
    // $("g[aria-labelledby]").hide();
  }

  GetCountryCities(countryName): void {
    var link = 'https://countriesnow.space/api/v0.1/countries/cities';

    var settings = {
      url: link,
      method: 'POST',
      timeout: 0,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ country: countryName }),
    };

    $.ajax(settings)
      .done((response) => {
        // display the dropdown
        $('#city_select').css('display', 'block');

        var countryArray = response.data;
        countryArray.forEach((item) => {
          this.cityList.push({
            value: item,
            html: item,
          });
        });
      })
      .fail((result) => {
        console.log(result);
      });
  }

  GetCountryContinent(countrycode): void {
    var link = `https://api.worldbank.org/v2/country/${countrycode}?format=json`;

    $.ajax(link, {
      method: 'GET',
      success(data) {
        console.log(data);
        $('#continent_title').css('display', 'block');
        var continent = data[1][0]['region']['value'];
        $('#continent_value').html(continent);
      },
    });
  }

  private emitCityCount() {
    return this.btnClick.emit({
      city: this.cities,
      country:
        this.selectedCountryList.length > 0
          ? this.selectedCountryList
          : this.countries,
    });
  }

  onCityItemSelected(event): void {
    $('#city_value').val(event);
  }

  onItemSelectCountries(item: any) {
    this.selectedCountryList.push(item);
    this.emitCityCount();
  }
  onItemSelectAllCountries(items: any) {
    this.selectedCountryList = items;
    this.emitCityCount();
  }

  onItemDeSelectCountry(item: any) {
    const index = this.selectedCountryList.indexOf(item);
    if (index > -1) {
      this.selectedCountryList.splice(index, 1); // 2nd parameter means remove one item only
      this.emitCityCount();
    }
  }
  onItemSelectCities(item: any) {
    this.selectedCityList.push(item);
  }
  onItemSelectAllCities(items: any) {
    console.log(items);
  }

  onItemDeSelectCity(item: any) {
    const index = this.selectedCityList.indexOf(item);
    if (index > -1) {
      this.selectedCityList.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  onFilterChange(item: any) {}

  cityPush(city) {
    if (this.cities.includes(city)) {
      const index = this.cities.indexOf(city);
      if (index !== -1) {
        this.cities.splice(index, 1);
        this.emitCityCount();
      }
    } else {
      this.cities.push(city);
      this.emitCityCount();
    }
  }
  private capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  timer: any;
  searchCity() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.search_city && this.search_city.length > 2) {
        const gotCity = exCity.filter((city) =>
          city.toLowerCase().includes(this.search_city.toLowerCase())
        );

        const array_copy = [...this.cities, ...gotCity];
        this.cityList = [...new Set(array_copy)];
        this.show_search = true;
      } else {
        this.show_search = false;
      }
    }, 1000);
  }

  searchClick() {
    this.show_search = !this.show_search;
  }

  countryAndCitySubmit() {
    this.trafficService
      .sendTrafficRule({
        country: this.selectedCountryList,
        city: this.cities,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
