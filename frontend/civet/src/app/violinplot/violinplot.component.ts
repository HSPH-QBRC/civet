import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
// import * as d3Collection from 'd3-collection';


@Component({
  selector: 'app-violinplot',
  templateUrl: './violinplot.component.html',
  styleUrls: ['./violinplot.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  changeDetection: ChangeDetectionStrategy.Default
})
export class ViolinplotComponent implements OnChanges {
  @Input() dataUR = []
  @Input() plotNum = ''
  isLoading = false;

  dataViolinPlot = []

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  vpMin = 10000000000;
  vpMax = -100000000000;
  categoryArr = [];
  bins = []
  idValue = 'my_violinplot';
  message = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.idValue = 'my_violinplot_' + this.plotNum;
    if (this.dataUR) {
      
      // console.log("on change: ", this.plotNum, this.dataUR, this.idValue)
      this.formatData()
    }
  }

  formatData() {
    for (let key in this.dataUR) {
      let obj = this.dataUR[key]
      let category = Object.keys(obj)[0];
      let value = obj[category];

      if (!this.categoryArr.includes(category)) {
        this.categoryArr.push(category)
      }

      this.vpMin = Math.min(this.vpMin, value);
      this.vpMax = Math.max(this.vpMax, value);

      let temp = {
        category: category,
        value: value
      }
      this.dataViolinPlot.push(temp)
    }
    if (this.dataViolinPlot.length === 0) {
      this.message = 'no plot to show';
    } else {
      // console.log("data VP:", this.dataViolinPlot, this.plotNum)
      this.cdRef.detectChanges();
      this.createSvg();
    }

  }

  createSvg() {
    // d3.select(`#${this.idValue}`)
    d3.select(`#my_violinplot_${this.plotNum}`)
      .selectAll('svg')
      .remove()
      .exit()

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 100 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // var svg = d3.select(`#${this.idValue}`)
    var svg = d3.select(`#my_violinplot_${this.plotNum}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Build and Show the Y scale
    var y = d3.scaleLinear()
      .domain([this.vpMin, this.vpMax])          // Note that here the Y scale is set manually
      .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))


    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3.scaleBand()
      .range([0, width])
      .domain(this.categoryArr)
      .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    // Features of the histogram
    var histogram = d3.histogram()
      .domain([this.vpMin, this.vpMax])
      // .domain(y.domain())
      .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d)

    var groupedData = Array.from(d3.group(this.dataViolinPlot, (d) => d['category']), ([key, value]) => ({ key, value }));

    var sumstat = groupedData.map((group) => ({
      key: group.key,
      value: histogram(group.value.map((d) => d['value'])), // Modify this line to suit your data
    }));

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0;
    for (let i in sumstat) {
      let allBins = sumstat[i].value
      let lengths = allBins.map(function (a) { return a.length; })
      let longuest = d3.max(lengths)
      if (longuest > maxNum) { maxNum = longuest }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum])

    // Add the shape to this svg!
    svg
      .selectAll(`#my_violinplot_${this.plotNum}`)
      .data(sumstat)
      .enter()        // So now we are working group per group
      .append("g")
      .attr("transform", function (d) {
        return ("translate(" + x(d.key) + " ,0)")
      }) // Translation on the right to be at the group position
      .append("path")
      .datum(function (d) {
        return (d.value)
      })     // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill", "#69b3a2")
      //@ts-ignore
      .attr("d", d3.area()
        .x0(function (d) { return (xNum(-d.length)) })
        .x1(function (d) { return (xNum(d.length)) })
        .y(function (d) { return (y(d['x0'])) })
        .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
      )
  }
}
