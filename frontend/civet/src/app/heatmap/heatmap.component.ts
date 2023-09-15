import { Component, ChangeDetectionStrategy, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
//@ts-ignore
import d3Tip from 'd3-tip';
import { HttpClient } from '@angular/common/http';
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class HeatmapComponent implements OnInit, OnChanges {
  @Input() dataHM
  @Input() xAxisLabel = ''
  @Input() yAxisLabel = ''

  // xArr = ["A", "B", "C"]
  // yArr = ["v1", "v2", "v3"]
  xArr = [];
  yArr = [];
  heatmapData = {
    // {
    //   xValue: "A",
    //   yValue: "v1",
    //   value: 30
    // },
    // {
    //   xValue: "A",
    //   yValue: "v2",
    //   value: 95
    // },
    // {
    //   xValue: "A",
    //   yValue: "v3",
    //   value: 22
    // },
    // {
    //   xValue: "B",
    //   yValue: "v1",
    //   value: 30
    // },
    // {
    //   xValue: "B",
    //   yValue: "v3",
    //   value: 22
    // },
  }

  heatmapDataArr = []
  minCount = 1000;
  maxCount = 0;

  ngOnInit(): void {
    for (let index in this.dataHM) {
      let xVal = this.dataHM[index]['xValue']
      let yVal = this.dataHM[index]['yValue']
      if (!this.xArr.includes(xVal)) {
        this.xArr.push(xVal)
      }
      if (!this.yArr.includes(yVal)) {
        this.yArr.push(yVal)
      }

      let newKey = `${xVal}_${yVal}`
      if (this.heatmapData[newKey] === undefined) {
        let temp = {
          xValue: xVal,
          yValue: yVal,
          value: 1
        }
        this.heatmapData[newKey] = temp
      } else {
        this.heatmapData[newKey].value += 1;
      }
    }
    //add for 0 values on the heatmap
    for (let i in this.xArr) {
      for (let j in this.yArr) {
        let xVal = this.xArr[i];
        let yVal = this.yArr[j];
        let newKey = `${xVal}_${yVal}`;
        if (this.heatmapData[newKey] === undefined) {
          let temp = {
            xValue: xVal,
            yValue: yVal,
            value: 0
          }
          this.heatmapData[newKey] = temp
        }
      }
    }
    //convert heatmap data to be an array
    for (let i in this.heatmapData) {
      this.minCount = Math.min(this.minCount, this.heatmapData[i]['value'])
      this.maxCount = Math.max(this.maxCount, this.heatmapData[i]['value'])
      this.heatmapDataArr.push(this.heatmapData[i])
    }
    this.createHeatMapSimple()
  }

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("there was a change to the heatmap")
  }

  createHeatMapSimple() {
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 145, bottom: 50, left: 50 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Count: </div> ${d.value}</div>
     <div><div class="category">X Value: </div> ${d.xValue}</div>
     <div><div class="category">Y Value: </div>${d.yValue}</div>`
        return tipBox
      });

    // append the svg object to the body of the page
    var svg = d3.select("#my_heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    svg.call(pointTip);

    // Build X scales and axis:
    var x = d3.scaleBand()
      .range([0, width])
      .domain(this.xArr)
      .padding(0.01);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    // Build X scales and axis:
    var y = d3.scaleBand()
      .range([height, 0])
      .domain(this.yArr)
      .padding(0.01);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Build color scale
    var myColor = d3.scaleLinear()
      // @ts-ignore
      .range(["royalblue", "crimson"])
      .domain([this.minCount, this.maxCount])

    svg.selectAll()
      .data(this.heatmapDataArr, function (d) { return d.xValue + '_' + d.yValue; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.xValue) })
      .attr("y", function (d) { return y(d.yValue) })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) { return myColor(d.value) })
      .on('mouseover', function (mouseEvent: any, d) {
        pointTip.show(mouseEvent, d, this);
        pointTip.style('left', mouseEvent.x + 10 + 'px');
      })
      .on('mouseout', pointTip.hide);

    svg.append('text')
      .classed('label', true)
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -height / 2)
      .attr('dy', '.71em')
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '8px')
      .text(this.yAxisLabel)

    svg
      .append('text')
      .classed('label', true)
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '8px')
      .text(this.xAxisLabel)

    var countColorData = [{ "color": "royalblue", "value": 0 }, { "color": "crimson", "value": this.maxCount }];
    var extent = d3.extent(countColorData, d => d.value);

    var paddingGradient = 15;
    var widthGradient = 180;
    var innerWidth = widthGradient - (paddingGradient * 2);
    var barHeight = 8;
    var heightGradient = 100;

    var xScaleCorr = d3.scaleLinear()
      .range([0, innerWidth - 100])
      .domain(extent);

    // var xTicks = countColorData.filter(f => f.value === this.min || f.value === this.max).map(d => d.value);
    let xTicksCorr = [0, this.maxCount]

    var xAxisGradient = d3.axisBottom(xScaleCorr)
      .tickSize(barHeight * 2)
      .tickValues(xTicksCorr);

    var countLegend = d3.select("#my_heatmap").select("svg")
      .append("svg")
      .attr("width", widthGradient)
      .attr("height", heightGradient)
      .attr('x', width + 85)
      .attr('y', 100);

    var defs = countLegend.append("defs");
    var linearGradient = defs
      .append("linearGradient")
      .attr("id", "myGradient");

    linearGradient.selectAll("stop")
      .data(countColorData)
      .enter().append("stop")
      .attr("offset", d => ((d.value - extent[0]) / (extent[1] - extent[0]) * 100) + "%")
      .attr("stop-color", d => d.color)

    var g = countLegend.append("g")
      .attr("transform", `translate(${paddingGradient + 10}, 30)`)

    g.append("rect")
      .attr("width", innerWidth - 100)
      .attr("height", barHeight)
      .style("fill", "url(#myGradient)");

    countLegend.append('text')
      .attr('y', 20)
      .attr('x', 17)
      .style('fill', 'rgba(0,0,0,.7)')
      .style('font-size', '11px')
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Count");

    g.append("g")
      .call(xAxisGradient)
      .select(".domain")
  }

}
