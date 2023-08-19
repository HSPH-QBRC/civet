import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// import d3Tip from 'd3-tip';
// import * as d3Tip from 'd3-tip';
//@ts-ignore
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.scss']
})
export class ScatterplotComponent implements OnInit {

  constructor() { }

  xMin = 0;
  xMax = 100;
  yMin = 0;
  yMax = 100;
  scatterPlotData = [
    {
      xValue: 1,
      yValue: 1
    },
    {
      xValue: 10,
      yValue: 10
    },
    {
      xValue: 3,
      yValue: 1
    }
  ];

  ngOnInit(): void {
    this.createScatterPlot()
  }

  createScatterPlot() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 100, left: 100 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Name:</div> ${d.name}</div>
    <div><div class="category">X Value: </div> ${d.xValue}</div>
    <div><div class="category">Y Value: </div>${d.yValue}</div>`
        return tipBox
      });

    const yAxisTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event) => {
        let tipBox = `<div><div class="category">Y Axis: Hello</div> </div>`
        return tipBox
      });

    const xAxisTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event) => {
        let tipBox = `<div><div class="category">X Axis: World</div> </div>`
        return tipBox
      });

    d3.select("#my_scatterplot")
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select("#my_scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(pointTip);
    svg.call(yAxisTip);
    svg.call(xAxisTip);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([this.xMin, this.xMax])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

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
      .attr("cx", function (d) { return x(d.xValue); })
      .attr("cy", function (d) { return y(d.yValue); })
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .on('mouseover', function (mouseEvent: any, d) {
        pointTip.show(mouseEvent, d, this);
        pointTip.style('left', mouseEvent.x + 10 + 'px');
      })
      .on('mouseout', pointTip.hide);

    //Y-Axis labels
    // if (this.typeOfLookUp === 'm2m' && this.metadataLookUp[this.metadata2Id].vardesc[0].length > 50) {
    //   svg.append('text')
    //     .classed('label', true)
    //     .attr('transform', 'rotate(-90)')
    //     .attr("font-weight", "bold")
    //     .attr('y', -margin.left + 10)
    //     .attr('x', -height / 2)
    //     .attr('dy', '.71em')
    //     .style('fill', 'rgba(0,0,0,.8)')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', '8px')
    //     .text(this.metadataLookUp[this.metadata2Id].vardesc[0].slice(0, 50) + "...")
    //     .on('mouseover', function (mouseEvent: any) {
    //       yAxisTip.show(mouseEvent, this);
    //       yAxisTip.style('left', mouseEvent.x + 10 + 'px');
    //       d3.select(this).style("cursor", "pointer");
    //     })
    //     .on('mouseout', function (mouseEvent: any) {
    //       d3.select(this).style("cursor", "default");
    //     })
    //     .on('mouseout', yAxisTip.hide);
    // } else {
    //   svg.append('text')
    //     .classed('label', true)
    //     .attr('transform', 'rotate(-90)')
    //     .attr("font-weight", "bold")
    //     .attr('y', -margin.left + 10)
    //     .attr('x', -height / 2)
    //     .attr('dy', '.71em')
    //     .style('fill', 'rgba(0,0,0,.8)')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', '8px')
    //     .text('hello');
    //   // .text(this.getYAxisLabelNames())
    //   // .text(this.typeOfLookUp === 'm2m' ? this.metadataLookUp[this.metadata2Id].vardesc[0].slice(0, 50) : this.symbolId === undefined ? this.metadata2Id : this.symbolId);
    // }


    //x-axis label
    // if (this.typeOfLookUp != 'g2g' && this.metadataLookUp[this.metadataId].vardesc[0].length > 50) {
    //   svg
    //     .append('text')
    //     .classed('label', true)
    //     .attr("font-weight", "bold")
    //     .attr('x', width / 2)
    //     .attr('y', height + margin.bottom - 10)
    //     .style('fill', 'rgba(0,0,0,.8)')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', '8px')
    //     .text(this.metadataLookUp[this.metadataId].vardesc[0].slice(0, 50) + "...")
    //     .on('mouseover', function (mouseEvent: any) {
    //       xAxisTip.show(mouseEvent, this);
    //       xAxisTip.style('left', mouseEvent.x + 10 + 'px');
    //       d3.select(this).style("cursor", "pointer");
    //     })
    //     .on('mouseout', function (mouseEvent: any) {
    //       d3.select(this).style("cursor", "default");
    //     })
    //     .on('mouseout', xAxisTip.hide);
    // } else {
    //   svg
    //     .append('text')
    //     .classed('label', true)
    //     .attr("font-weight", "bold")
    //     .attr('x', width / 2)
    //     .attr('y', height + margin.bottom - 10)
    //     .style('fill', 'rgba(0,0,0,.8)')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', '12px')
    //     .text(this.getXAxisLabelNames());
    // }
  }
}
