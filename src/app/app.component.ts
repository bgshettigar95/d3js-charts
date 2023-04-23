import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'd3js';
  graphData: any[] = [];
  years: any[] = [];
  displayGraphData: any[] = [];
  selectedYear: string = '';
  totalPopulation: number | string = 0;

  ngOnInit() {
    d3.csv('../assets/population.csv').then((data) => {
      this.graphData = data;
      this.formatData();
      this.years = data.map((populationData) => populationData['Year']);
      this.years = [...new Set(this.years)].sort((a, b) => b - a);
      this.displayGraphData = this.graphData.filter((populationData) => {
        if (populationData['Year'] === this.years[0]) {
          this.totalPopulation += populationData['Population (000s)'];
        }
        return populationData['Year'] === this.years[0];
      });
      this.selectedYear = this.years[0];
      this.totalPopulation =
        (Math.abs(Number(this.totalPopulation)) / 1.0e7).toFixed(2) + 'Mn';
    });
  }

  formatData() {
    this.graphData.forEach((data) => {
      for (const key in data) {
        data[key] = isNaN(Number(data[key])) ? data[key] : Number(data[key]);
      }
    });
  }

  onSelectionChange(event: any) {
    this.totalPopulation = 0;
    this.displayGraphData = this.graphData.filter((populationData) => {
      if (populationData['Year'] === event.value) {
        this.totalPopulation += populationData['Population (000s)'];
      }
      return populationData['Year'] === event.value;
    });
    this.totalPopulation =
      (Math.abs(this.totalPopulation) / 1.0e7).toFixed(2) + 'Mn';
  }
}
