import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
//@ts-ignore
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class HistogramComponent implements OnChanges {
  @Input() dataHistogram
  @Input() id = ''
  @Input() category = ''
  dataSize = 0;
  isLoading = false;
  min = 0;
  max = -Infinity;
  hideHistogram = false;

  countArr = [];

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.min = 1000;
    this.max = 0;

    for (let i in this.dataHistogram) {
      for (let key in this.dataHistogram[i]) {
        let value = this.dataHistogram[i][key]
        let tempObject = {
          "value": parseInt(value)
        }
        this.countArr.push(tempObject)
        this.min = Math.min(this.min, value)
        this.max = Math.max(this.max, value)
      }
    }
    this.hideHistogram = false;
    this.cdRef.detectChanges();
    this.createHistogram()
  }

  createHistogram() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 100, left: 100 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Interval: ${d.x0} - ${d.x1}</div></div>
    <div><div class="category">Count: </div> ${d.count}</div>`
        return tipBox
      });

    d3.select(`.my_histogram_${this.id}`)
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select(`.my_histogram_${this.id}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(pointTip);

    // X axis: scale and draw:
    var x = d3.scaleLinear()
      .domain([this.min, this.max])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")

    // set the parameters for the histogram
    var histogram = d3.histogram()
      .value(function (d) { return d['value']; })   // I need to give the vector of value
      .domain([0, this.max])  // then the domain of the graphic
      .thresholds(x.ticks(20)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(this.countArr);

    let y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
      .data(bins, d => d['x0'])
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function (d) { return Math.abs(x(d.x1) - x(d.x0) - 1); })
      .attr("height", function (d) { return height - y(d.length); })
      .style("fill", "#69b3a2")
      .on('mouseover', function (mouseEvent: any, d) {
        pointTip.show(mouseEvent, d, this);
        pointTip.style('left', mouseEvent.x + 10 + 'px');
      })
      .on('mouseout', pointTip.hide);

    svg.append('text')
      .classed('label', true)
      .attr('transform', 'rotate(-90)')
      .attr("font-weight", "bold")
      .attr('y', -margin.left + 10)
      .attr('x', -height / 2)
      .attr('dy', '.71em')
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Counts');

    svg
      .append('text')
      .classed('label', true)
      .attr("font-weight", "bold")
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(this.category);
  }
}

