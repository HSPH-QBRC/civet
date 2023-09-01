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
  @Input() receivedData: any;
  @Input() plotNum: any;
  @Input() dataDictionary = {}
  @Input() selectedCategory = ''
  @Input() minYScatterplot: number;
  @Input() maxYScatterplot: number;

  idValue = 'my_scatterplot';

  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']
  message = '';

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  yMin = 1000;
  yMax = 0;
  scatterPlotData: { key: string; xValue: string; yValue: any; }[] = [];
  lineData: { key: string; xValue: string; yValue: any; }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.idValue = 'my_scatterplot_' + this.plotNum;
    if (this.receivedData) {
      this.formatData(this.receivedData);
    }
  }

  formatData(data: { [key: string]: { [key: string]: any }; }) {
    this.scatterPlotData = [];

    for (let [key, value] of Object.entries(data)) {
      let xLabel = 'VISIT_1'
      let temp = {
        'key': key,
        'xValue': xLabel,
        'yValue': value[xLabel]
      }
      this.scatterPlotData.push(temp)

      let xLabel2 = 'VISIT_4';
      if (value[xLabel2]) {
        let temp2 = {
          'key': key,
          'xValue': xLabel2,
          'yValue': value[xLabel2]
        }
        this.scatterPlotData.push(temp2)
        this.lineData.push(temp)
        this.lineData.push(temp2)
      }

      if (this.minYScatterplot !== undefined) {
        this.yMin = this.minYScatterplot;
        this.yMax = this.maxYScatterplot;
      } else {
        this.yMin = value[xLabel2] ? Math.min(value[xLabel], value[xLabel2], this.yMin) : Math.min(value[xLabel], this.yMin)
        this.yMax = value[xLabel2] ? Math.max(value[xLabel], value[xLabel2], this.yMax) : Math.max(value[xLabel], this.yMax)

      }


    }

    if (this.lineData.length === 0) {
      this.message = 'no plot to show';
    } else {
      this.cdRef.detectChanges();
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
    // .padding(0.1);

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
      .domain([this.yMin, this.yMax])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));


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
      .style("fill", "#69b3a2")
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
      .style("stroke", "#69b3a2")
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
      .text(this.dataDictionary[this.selectedCategory] ? (this.dataDictionary[this.selectedCategory][category] === undefined ? category : this.dataDictionary[this.selectedCategory][category]) : 'title');
  }
}
