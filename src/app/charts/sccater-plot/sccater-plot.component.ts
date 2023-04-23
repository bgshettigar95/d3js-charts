import * as d3 from 'd3';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-sccater-plot',
  templateUrl: './sccater-plot.component.html',
  styleUrls: ['./sccater-plot.component.scss'],
})
export class SccaterPlotComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  loader = true;
  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawChart();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.drawChart();
  }

  drawChart() {
    let currentWidth = parseInt(d3.select('#chart').style('width'), 10);
    const data = this.data;
    var margin = { top: 10, right: 30, bottom: 50, left: 30 },
      width = currentWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    d3.selectAll('svg').remove();
    d3.selectAll('.tooltip').remove();

    var svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3
      .scaleLog()
      .domain([1, d3.max(data, (data) => data['Population_Density'])])
      .range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([
        ...d3.extent(this.data, (data) => data['Population_Growth_Rate']),
      ])
      .range([height, 0]);

    let maxPopulation = d3.max(this.data, (data) => data['Population (000s)']);
    let z = d3.scaleSqrt().domain([0, maxPopulation]).range([5, 25]);

    let mycolor = d3
      .scaleOrdinal()
      .domain(data.map((d) => d['Country']))
      .range([
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
      ]);

    let tickValues =
      currentWidth > 700
        ? [0, 10, 100, 1000, 10000, 20000]
        : [0, 10, 1000, 20000];

    svg
      .append('g')
      .attr('transform', 'translate(' + 20 + ',' + height + ')')
      .call(
        d3
          .axisBottom(x)
          .scale(x)
          .tickValues(tickValues)
          .tickFormat(d3.format(''))
      );

    svg
      .append('g')
      .attr('transform', 'translate(20,0)')
      .call(d3.axisLeft(y).scale(y).ticks(5));

    const tooltip = d3
      .select('#chart')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('position', 'absolute');

    const mouseover = (event: any, d: any) => {
      tooltip.transition().duration(200).style('opacity', 1);
      tooltip
        .html(
          '<h3>Country: ' +
            d['Country'] +
            '</h3>' +
            ' <span>Population_Density:' +
            d['Population_Density'] +
            ' </span><br> <span> Population_Growth_Rate: ' +
            d['Population_Growth_Rate'] +
            ' </span>'
        )
        .style('left', event.x + 'px')
        .style('top', event.y + 'px');
    };

    const mouseleave = (event: any, d: any) => {
      tooltip.transition().duration(200).style('opacity', 0);
    };

    svg
      .append('g')
      .attr('transform', 'translate(20,0)')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d['Population_Density']))
      .attr('cy', (d) => y(d['Population_Growth_Rate']))
      .attr('r', (d) => z(d['Population (000s)']))
      .style('fill', (d): any => mycolor(d['Country']))
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    svg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'center')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text('Population Density');

    svg
      .append('text')
      .attr('class', 'y-label')
      .attr('transform', 'translate(0,' + height / 2 + ')')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .text('Population Growth');
  }
}
