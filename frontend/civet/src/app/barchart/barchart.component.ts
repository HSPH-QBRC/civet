import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
//@ts-ignore
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class BarchartComponent implements OnInit, OnChanges {
  @Input() dataBarchart
  @Input() id: string = '';
  @Input() category: string = '';
  @Input() dataDictionary = {}
  dataSize = 0;
  isLoading = false;

  barChartData = [];
  categoryArr = [];
  categoryCount = {}
  countArr = [];
  maxCount = 1;
  min = Infinity;
  max = -Infinity;
  sumstat = [];

  maxXaxisLabelLength = 0;
  hideBarchart = false;


  constructor(
    // private httpClient: HttpClient,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.hideBarchart = true;
    this.barChartData = [];
    this.categoryArr = [];
    this.categoryCount = {}
    this.countArr = [];
    this.maxCount = 1;
    this.min = Infinity;
    this.max = -Infinity;
    this.sumstat = [];
    this.maxXaxisLabelLength = 0;

    if (this.dataBarchart) {
      this.formatData()
    }
  }

  formatData() {
    let tempArr = {}
    for (let obj in this.dataBarchart) {
      if (this.dataBarchart.hasOwnProperty(obj)) {
        for (let key in this.dataBarchart[obj]) {
          if (!tempArr[key]) {
            tempArr[key] = []
          }
          tempArr[key].push(this.dataBarchart[obj][key])
        }
      }
    }

    for (let key in tempArr) {
      let temp = {
        name: key,
        count: tempArr[key].length
      }
      this.countArr.push(temp)
      this.maxCount = Math.max(this.maxCount, tempArr[key].length)
    }
    this.hideBarchart = false;
    this.isLoading = false;

    this.cdRef.detectChanges();
    this.createBarChart()
  }

  createBarChart() {
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 100, left: 100 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const pointTip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((event, d) => {
        let tipBox = `<div><div class="category">Name: </div> ${d.name.length === 0 ? "N/A" : d.name}</div>
    <div><div class="category">Count: </div> ${d.count}</div>`
        return tipBox
      });

    d3.select(`.my_barchart_${this.id}`)
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select(`.my_barchart_${this.id}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(pointTip);

    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(this.countArr.map(function (d) { return d.name; }))
      .padding(0.2);

    let rotateText = (this.countArr.length > 5) ? "translate(-10,0)rotate(-45)" : "translate(-10,0)";
    let xAxisLabels = (this.countArr.length > 55) ? d3.axisBottom(x).tickFormat((d) => '').tickSize(0) : d3.axisBottom(x);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisLabels)
      .selectAll("text")
      .attr("transform", rotateText)
      .style("text-anchor", "end")
      .call(wrap, margin.bottom)

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, this.maxCount])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
      .data(this.countArr)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.name); })
      .attr("y", function (d) { return y(d.count); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.count); })
      .attr("fill", "#69b3a2")
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
      .attr('y', height + margin.bottom - 20)
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(this.category);

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }
}
