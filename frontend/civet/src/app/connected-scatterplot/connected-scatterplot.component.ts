import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
//@ts-ignore
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-connected-scatterplot',
  templateUrl: './connected-scatterplot.component.html',
  styleUrls: ['./connected-scatterplot.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ConnectedScatterplotComponent implements OnChanges {
  @Input() dataPl: any;
  @Input() plotNum: any;
  @Input() dataDictionary = {}
  @Input() selectedCategory = ''
  @Input() minYScatterplot: number;
  @Input() maxYScatterplot: number;

  idValue = 'my_scatterplot';
  containerId = 'my_scatterplot_Scatter_Plot';
  imageName = "test_download"

  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']
  message = '';

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  yMin = 1000;
  yMax = 0;
  scatterPlotData: { key: string; xValue: string; yValue: any; }[] = [];
  lineData: { key: string; xValue: string; yValue: any; }[] = [];

  logCheckbox: boolean = false;



  ngOnChanges(changes: SimpleChanges): void {
    this.idValue = 'my_scatterplot_' + this.plotNum;
    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  minYRange = 0;
  maxYRange = 10;
  newYRangeSet = false;

  updateRange() {
    this.minYRange = Number(this.minYRange)
    this.maxYRange = Number(this.maxYRange)

    this.yMin = this.minYRange;
    this.yMax = this.maxYRange;
    this.newYRangeSet = true;

    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  onCheckboxChange() {
    if (!this.newYRangeSet) {
      this.yMin = 1000;
      this.yMax = 0;
    } else if (this.logCheckbox) {
      this.minYRange = Math.log2(this.minYRange);
      this.maxYRange = Math.log2(this.maxYRange);
    } else {
      this.minYRange = Math.floor(Math.pow(2, this.minYRange));
      this.maxYRange = Math.ceil(Math.pow(2, this.maxYRange));
    }

    if (this.dataPl) {
      this.formatData(this.dataPl);
    }
  }

  formatData(data: { [key: string]: { [key: string]: any }; }) {
    this.scatterPlotData = [];

    for (let [key, value] of Object.entries(data)) {
      let xLabel = 'VISIT_1';
      let yVal1 = this.logCheckbox ? Math.log2(value[xLabel]) : value[xLabel]
      let temp = {
        'key': key,
        'xValue': xLabel,
        'yValue': yVal1
      }

      if (this.newYRangeSet && yVal1 >= this.minYRange && yVal1 <= this.maxYRange) {
        this.scatterPlotData.push(temp)
      } else if (!this.newYRangeSet) {
        this.scatterPlotData.push(temp)
      }

      let xLabel2 = 'VISIT_4';
      let yVal2 = this.logCheckbox ? Math.log2(value[xLabel2]) : value[xLabel2]
      if (value[xLabel2]) {
        let temp2 = {
          'key': key,
          'xValue': xLabel2,
          'yValue': yVal2
        }

        if (this.newYRangeSet && yVal2 >= this.minYRange && yVal2 <= this.maxYRange) {
          this.scatterPlotData.push(temp2)
        } else if (!this.newYRangeSet) {
          this.scatterPlotData.push(temp2)
        }

        this.lineData.push(temp)
        this.lineData.push(temp2)
      }

      if (this.minYScatterplot !== undefined) {
        this.yMin = this.minYScatterplot;
        this.yMax = this.maxYScatterplot;
      } else {
        this.yMin = yVal2 ? Math.min(yVal1, yVal2, this.yMin) : Math.min(yVal1, this.yMin)
        this.yMax = yVal2 ? Math.max(yVal1, yVal2, this.yMax) : Math.max(yVal1, this.yMax)
      }
    }

    if (this.lineData.length === 0) {
      this.message = 'no plot to show';
    } else {
      this.cdRef.detectChanges();

      if (!this.newYRangeSet) {
        this.minYRange = Math.floor(this.yMin)
        this.maxYRange = Math.ceil(this.yMax)
      }

      this.createScatterPlot()
    }
  }

  createScatterPlot() {
    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 30, bottom: 50, left: 70 },
      width = 460 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Name: </div> ${d.key}</div>
     <div><div class="category">X Value: </div> ${d.xValue}</div>
     <div><div class="category">Y Value: </div>${d.yValue}</div>`
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

    d3.select(`#my_scatterplot_${this.plotNum}`)
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select(`#my_scatterplot_${this.plotNum}`)
      .append("svg")
      .attr("id", "yourIdName")
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
    var x = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .paddingInner(1)

    const bandWidth = x.bandwidth();

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickSize(0) // Remove tick marks
      )
      .selectAll("text")
      .style("text-anchor", "start") // Align text to the start of the band
      .attr("dx", (-bandWidth / 2 - 15)) // Adjust the horizontal position of labels
      .attr("dy", "20px"); // Adjust the vertical position of labels

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([this.minYRange, this.maxYRange])
      .range([height, 0]);
    svg.append("g")
      .call(this.logCheckbox ? d3.axisLeft(y).tickFormat(d => `${Math.pow(2, +d)}`) : d3.axisLeft(y));


    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(this.scatterPlotData)
      .enter()
      .append("circle")
      // .attr("cx", function (d) { return x(d.xValue); })
      .attr("cx", function (d) { return String(x(d.xValue)); })
      .attr("cy", function (d) { return y(d.yValue); })
      .attr("r", 3)
      .style("fill", "rgba(105, 179, 162, .5)")
      .on('mouseover', function (mouseEvent: any, d) {
        pointTip.show(mouseEvent, d, this);
        pointTip.style('left', mouseEvent.x + 10 + 'px');
      })
      .on('mouseout', pointTip.hide);

    const groupedData = d3.group(this.scatterPlotData, d => d.key);

    const line = d3.line<{ xValue: string; yValue: number }>()
      .x(d => {
        const xValue = x(d.xValue);
        return xValue !== undefined ? xValue : 0; // Provide a default value or handle missing data appropriately
      })
      .y(d => {
        const yValue = y(d.yValue);
        return yValue !== undefined ? yValue : 0; // Provide a default value or handle missing data appropriately
      });

    svg.selectAll(".line")
      .data(groupedData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", d => line(d[1])) // "d[1]" contains the grouped data, which is an array of points with matching "key" values
      .style("stroke", "rgba(105, 179, 162, .3)")
      .style("stroke-width", 1)
      .style("fill", "none");

    svg.append("text")
      .attr("transform", "rotate(-90)") // Rotate the text to make it vertical
      .attr("y", 0 - margin.left) // Position it to the left of the left margin
      .attr("x", 0 - (height / 2)) // Position it in the middle of the height
      .attr("dy", "1em") // Adjust the vertical position
      .style("font-size", "10px")
      .style("text-anchor", "middle") // Center-align the text
      .text("Mitochondrial Counts");

    let category = !isNaN(Number(this.plotNum)) && !this.dataDictExclude.includes(this.selectedCategory) ? this.plotNum + '.0' : this.plotNum

    svg.append("text")
      .attr("x", (width / 2)) // Center the text horizontally
      .attr("y", 0 - (margin.top / 2) + 15) // Position it above the top margin
      .attr("text-anchor", "middle") // Center-align the text horizontally
      .style("font-size", "12px") // Set the font size
      .text(this.dataDictionary[this.selectedCategory] ? (this.dataDictionary[this.selectedCategory][category] === undefined ? category : this.dataDictionary[this.selectedCategory][category]) : 'Scatter Plot');
  }
}
