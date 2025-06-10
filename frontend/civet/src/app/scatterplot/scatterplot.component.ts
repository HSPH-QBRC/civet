import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
//@ts-ignore
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ScatterplotComponent implements OnChanges {
  @Input() dataPl: any;
  @Input() plotNum: any;
  @Input() xAxisLabel = ''
  @Input() yAxisLabel = ''

  imageName = 'scatterplot'
  idValue = 'my_scatterplot';

  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']
  message = '';

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  yMin = 1000;
  yMax = 0;
  xMin = 1000;
  xMax = 0;
  scatterPlotData: { key: string; xValue: any; yValue: any; }[] = [];
  logCheckboxX: boolean = false;
  logCheckboxY: boolean = false;

  minYRange = 10
  maxYRange = 0
  minXRange = 10
  maxXRange = 0

  newXRangeSet: boolean = false;
  newYRangeSet: boolean = false;
  noPlot = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.idValue = 'my_scatterplot_' + this.plotNum;
    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  updateRange(axis) {
    if (axis === 'yAxis') {
      this.minYRange = Number(this.minYRange)
      this.maxYRange = Number(this.maxYRange)

      this.yMin = this.minYRange;
      this.yMax = this.maxYRange;
      this.newYRangeSet = true;
    }

    if (axis === 'xAxis') {
      this.minXRange = Number(this.minXRange)
      this.maxXRange = Number(this.maxXRange)

      this.xMin = this.minXRange;
      this.xMax = this.maxXRange;
      this.newXRangeSet = true;
    }


    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  onCheckboxChange(axis) {
    if (axis === 'yAxis') {
      if (!this.newYRangeSet) {
        this.yMin = 1000;
        this.yMax = 0;
      } else if (this.logCheckboxY) {
        this.minYRange = Math.log2(this.minYRange);
        this.maxYRange = Math.log2(this.maxYRange);
      } else {
        this.minYRange = Math.floor(Math.pow(2, this.minYRange));
        this.maxYRange = Math.ceil(Math.pow(2, this.maxYRange));
      }
    }

    if (axis === 'xAxis') {
      if (!this.newXRangeSet) {
        this.xMin = 1000;
        this.xMax = 0;
      } else if (this.logCheckboxX) {
        this.minXRange = Math.log2(this.minXRange);
        this.maxXRange = Math.log2(this.maxXRange);
      } else {
        this.minXRange = Math.floor(Math.pow(2, this.minXRange));
        this.maxXRange = Math.ceil(Math.pow(2, this.maxXRange));
      }
    }

    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  formatData(data: { [key: string]: { [key: string]: any }; }) {
    this.scatterPlotData = [];

    for (let [key, value] of Object.entries(data)) {
      let xValue = this.logCheckboxX ? Math.log2(value['xValue']) : value['xValue']
      let yValue = this.logCheckboxY ? Math.log2(value['yValue']) : value['yValue']
      let temp = {
        'key': key,
        'xValue': xValue,
        'yValue': yValue
      }
      if (!this.newYRangeSet && !this.newXRangeSet) {
        this.scatterPlotData.push(temp)
        this.xMin = Math.min(this.xMin, xValue)
        this.xMax = Math.max(this.xMax, xValue)
        this.yMin = Math.min(this.yMin, yValue)
        this.yMax = Math.max(this.yMax, yValue)
      }
      else if ((this.newYRangeSet || this.newXRangeSet) && yValue >= this.minYRange && yValue <= this.maxYRange && xValue >= this.minXRange && xValue <= this.maxXRange) {
        this.scatterPlotData.push(temp)
        this.xMin = Math.min(this.xMin, xValue)
        this.xMax = Math.max(this.xMax, xValue)
        this.yMin = Math.min(this.yMin, yValue)
        this.yMax = Math.max(this.yMax, yValue)
      }


    }

    if (this.scatterPlotData.length === 0) {
      this.message = 'no plot to show';
    } else {
      this.message = '';
      this.cdRef.detectChanges();

      if (!this.newXRangeSet) {
        this.minXRange = Math.floor(this.xMin * 100) / 100;
        this.maxXRange = Math.ceil(this.xMax * 100) / 100;
      }

      if (!this.newYRangeSet) {
        this.minYRange = Math.floor(this.yMin * 100) / 100;
        this.maxYRange = Math.ceil(this.yMax * 100) / 100;
      }

      this.createScatterPlot()
    }
  }

  createScatterPlot() {
    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 30, bottom: 100, left: 70 },
      width = 460 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Name: </div> ${d.key}</div>
     <div><div class="category">X Value: </div> ${this.logCheckboxX ? Math.pow(2, d.xValue).toLocaleString() : d.xValue}</div>
     <div><div class="category">Y Value: </div>${this.logCheckboxY ? Math.pow(2, d.yValue).toLocaleString() : d.yValue}</div>`
        return tipBox
      });

    const yAxisTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event) => {
        let tipBox = `<div><div class="category">Y Axis: </div> </div>`
        return tipBox
      });

    const xAxisTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event) => {
        let tipBox = `<div><div class="category">X Axis: World</div> </div>`
        return tipBox
      });

    d3.select(`#${this.idValue}`)
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select(`#${this.idValue}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(pointTip);
    svg.call(yAxisTip);
    svg.call(xAxisTip);

    var categories = ['VISIT_1', 'VISIT_4'];

    // Add X axis
    // var x = d3.scaleBand() //change to scale linear
    //   .domain(categories)
    //   .range([0, width])
    //   // .paddingInner(1)

    var x = d3.scaleLinear()
      // .domain([this.xMin, this.xMax])
      .domain([this.minXRange, this.maxXRange])
      .range([0, width]);

    // const bandWidth = x.bandwidth();

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      // .call(d3.axisBottom(x)
      //   .tickSize(0) // Remove tick marks
      // )
      .call(this.logCheckboxX ? d3.axisBottom(x).tickFormat(d => `${Math.pow(2, +d).toLocaleString()}`) : d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "start") // Align text to the start of the band
      .attr("dx", "-.8em")
      // .attr("dx", -bandWidth)
      // .attr("dx", (-bandWidth / 2 - 15)) // Adjust the horizontal position of labels
      .attr("dy", "20px"); // Adjust the vertical position of labels

    // Add Y axis
    var y = d3.scaleLinear()
      // .domain([this.yMin, this.yMax])
      .domain([this.minYRange, this.maxYRange])
      .range([height, 0]);
    svg.append("g")
      // .call(d3.axisLeft(y));
      .call(this.logCheckboxY ? d3.axisLeft(y).tickFormat(d => `${Math.pow(2, +d).toLocaleString()}`) : d3.axisLeft(y));


    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(this.scatterPlotData)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.xValue); })
      // .attr("cx", function (d) { return x(d.xValue); })
      .attr("cy", function (d) { return y(d.yValue); })
      .attr("r", 3)
      .style("fill", "#69b3a2")
      .on('mouseover', function (mouseEvent: any, d) {
        pointTip.show(mouseEvent, d, this);
        pointTip.style('left', mouseEvent.x + 10 + 'px');
      })
      .on('mouseout', pointTip.hide);

    const groupedData = d3.group(this.scatterPlotData, d => d.key);

    // const line = d3.line<{ xValue: string; yValue: number }>()
    //   .x(d => {
    //     const xValue = x(d.xValue);
    //     return xValue !== undefined ? xValue : 0; // Provide a default value or handle missing data appropriately
    //   })
    //   .y(d => {
    //     const yValue = y(d.yValue);
    //     return yValue !== undefined ? yValue : 0; // Provide a default value or handle missing data appropriately
    //   });

    // svg.selectAll(".line")
    //   .data(groupedData)
    //   .enter()
    //   .append("path")
    //   .attr("class", "line")
    //   .attr("d", d => line(d[1])) // "d[1]" contains the grouped data, which is an array of points with matching "key" values
    //   .style("stroke", "#69b3a2")
    //   .style("stroke-width", 1)
    //   .style("fill", "none");

    svg.append("text")
      .attr("transform", "rotate(-90)") // Rotate the text to make it vertical
      .attr("y", 0 - margin.left) // Position it to the left of the left margin
      .attr("x", 0 - (height / 2)) // Position it in the middle of the height
      .attr("dy", "1em") // Adjust the vertical position
      .style("font-size", "10px")
      .style("text-anchor", "middle") // Center-align the text
      .text(this.yAxisLabel);

    svg
      .append('text')
      .classed('label', true)
      .attr("font-weight", "bold")
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 40)
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .text(this.xAxisLabel);

    // let category = !isNaN(Number(this.plotNum)) && !this.dataDictExclude.includes(this.selectedCategory) ? this.plotNum + '.0' : this.plotNum

    svg.append("text")
      .attr("x", (width / 2)) // Center the text horizontally
      .attr("y", 0 - (margin.top / 2) + 15) // Position it above the top margin
      .attr("text-anchor", "middle") // Center-align the text horizontally
      .style("font-size", "12px") // Set the font size
      .text(`${this.xAxisLabel} vs ${this.yAxisLabel} [${this.yMin.toFixed(2)} - ${this.yMax.toFixed(2)}]`);
  }
}
