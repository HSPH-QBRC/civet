import { Component, ChangeDetectionStrategy, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mev-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistogramMiniComponent implements OnChanges {
  @Input() idValue
  @Input() data
  @Input() currentDataset
  @Input() category
  @Input() mainQuery
  @Input() sliderdata

  private readonly API_URL = 'https://dev-civet-jq-api.tm4.org/api';

  facetField
  histogramDataStorage = {
    'civet': {}
  }
  countArray = [];
  queryParams: string = '';

  constructor(private httpClient: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.mainQuery;
    this.countArray = [];
    this.getData(this.currentDataset, this.category);
  }

  getQueryResults(queryString) {
    return this.httpClient.get(queryString)
  }

  getData(dataset, category) {
    let query = `${this.API_URL}/subject-query/?q=${this.queryParams}&facet=true&facet.field=${category}`;
    this.getQueryResults(query)
      .subscribe(res => {
        this.facetField = res['facet_counts']['facet_fields'];
        for (let subcat in this.facetField) {
          let arr = this.facetField[subcat]
          this.histogramDataStorage[dataset][subcat] = []
          for (let i = 0; i < arr.length; i += 2) {
            let obj = {};
            obj[arr[i]] = arr[i + 1];
            this.histogramDataStorage[dataset][subcat].push(obj)
          }
        }

        for (let i = 0; i < this.histogramDataStorage[dataset][category].length; i++) {
          let object1 = this.histogramDataStorage[dataset][category][i]
          for (const [key, value] of Object.entries(object1)) {
            let tempObject = {
              "value": parseInt(key)
            }
          
            for (let j = 0; j < Number(value); j++) {
              this.countArray.push(tempObject)
            }
          }
        }
        let min = this.sliderdata[dataset][category]["floor"];
        let max = this.sliderdata[dataset][category]["ceil"]
        this.createHistogram(min, max);

      })
  }

  createHistogram(min, max) {
    d3.select(`#${this.idValue}`)
      .selectAll('svg')
      .remove()
      .exit()

    // set the dimensions and margins of the graph
    let margin = { top: 10, right: 10, bottom: 20, left: 10 },
      width = 180 - margin.left - margin.right,
      height = 140 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select(`#${this.idValue}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // X axis: scale and draw:
    let x = d3.scaleLinear()
      .domain([min, max])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues([]).tickSizeOuter(0));

    // set the parameters for the histogram
    let histogram = d3.histogram()
      .value(function (d) { return d['value']; })   // I need to give the vector of value
      .domain([min, max] as [number, number])
      .thresholds(x.ticks(20)); // then the numbers of bins

    // And apply this function to data to get the bins
    let bins = histogram(this.countArray);
    // Y axis: scale and draw:
    let y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    // append the bar rectangles to the svg element
    let bar = svg.selectAll<SVGRectElement, d3.Bin<number, number>>("rect")
      .data(bins, d => d['x0'])

    bar.exit().remove()
      .transition()
      .duration(1500)

    bar
      .enter()
      .append("rect")
      .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function (d) { return Math.abs(x(d.x1) - x(d.x0) - 1); })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#69b3a2")
      .style("opacity", 0.6)
      .merge(bar)
      .attr("height", function (d) { return height - y(d.length); })
  }



}
