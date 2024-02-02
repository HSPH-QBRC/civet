import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-violinplot',
  templateUrl: './violinplot.component.html',
  styleUrls: ['./violinplot.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ViolinplotComponent implements OnChanges {
  @Input() dataUR = []
  @Input() plotNum = ''
  @Input() dataDictionary = {}
  @Input() selectedCategory = '';
  @Input() minYViolinplot: number;
  @Input() maxYViolinplot: number;
  @Input() maxValue: number;
  @Input() numberOfBins;
  @Input() yAxisLabel
  @Input() xAxisLabel

  imageName = 'violinplot'

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
  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED'];
  logCheckbox: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.idValue = 'my_violinplot_' + this.plotNum;
    this.category = !isNaN(Number(this.plotNum)) && !this.dataDictExclude.includes(this.selectedCategory) ? this.plotNum + '.0' : this.plotNum
    if (changes.numberOfBins && !changes.numberOfBins.firstChange) {
      if (this.dataUR) {
        this.resetVariables();
        this.formatData()
      }
    } else if ((changes.maxValue && !changes.maxValue.firstChange) || !this.maxValue) {
      if (this.dataUR) {
        this.resetVariables();
        this.formatData()
      }
    } else {
      this.resetVariables();
      this.formatData()
    }
  }

  minYRange = 0;
  maxYRange = 10;
  newYRangeSet = false;

  updateRange() {
    this.minYRange = Number(this.minYRange)
    this.maxYRange = Number(this.maxYRange)

    this.resetVariables()
    this.vpMin = this.minYRange;
    this.vpMax = this.maxYRange;
    this.newYRangeSet = true;

    this.formatData();
  }

  onCheckboxChange() {
    this.resetVariables()
    if (!this.newYRangeSet) {
      this.vpMin = 10000000000;
      this.vpMax = -10000000000;
    }
    else if (this.logCheckbox) {
      this.minYRange = Math.log2(this.minYRange);
      this.maxYRange = Math.log2(this.maxYRange);
    } else {
      this.minYRange = Math.floor(Math.pow(2, this.minYRange));
      this.maxYRange = Math.ceil(Math.pow(2, this.maxYRange));
    }
    this.formatData();
  }

  resetVariables() {
    this.vpMin = 10000000000;
    this.vpMax = -100000000000;
    this.categoryArr = [];
    this.bins = []
    this.message = '';
    this.dataViolinPlot = [];
  }

  formatData() {
    for (let key in this.dataUR) {
      let obj = this.dataUR[key]
      let category = Object.keys(obj)[0];
      // let value = obj[category];
      let value = this.logCheckbox ? Math.log2(obj[category]) : obj[category];

      if ((parseInt(category) || category === '0') && !this.dataDictExclude.includes(this.xAxisLabel)) {
        category = this.dataDictionary[this.xAxisLabel][category + '.0']
      } else if ((parseInt(category) || category === '0') && this.dataDictExclude.includes(this.xAxisLabel)) {
        category = this.dataDictionary[this.xAxisLabel][category]
      }

      if (this.newYRangeSet && value >= this.minYRange && value <= this.maxYRange) {
        this.categoryArr.push(category)
      } else if (!this.newYRangeSet) {
        this.categoryArr.push(category)
      }

      // if (!this.categoryArr.includes(category)) {
      //   this.categoryArr.push(category)
      // }

      if (this.minYViolinplot !== undefined) {
        this.vpMin = this.minYViolinplot;
        this.vpMax = this.maxYViolinplot;
      } else {
        this.vpMin = Math.min(this.vpMin, value);
        this.vpMax = Math.max(this.vpMax, value);
      }

      let temp = {
        category: category,
        value: value
      }

      if (this.newYRangeSet && value >= this.minYRange && value <= this.maxYRange) {
        this.dataViolinPlot.push(temp)
      } else if (!this.newYRangeSet) {
        this.dataViolinPlot.push(temp)
      }
    }
    if (this.dataViolinPlot.length === 0) {
      this.message = 'no plot to show';
    } else {
      this.cdRef.detectChanges();

      if (!this.newYRangeSet) {
        this.minYRange = Math.floor(this.vpMin * 100) / 100;
        this.maxYRange = Math.ceil(this.vpMax * 100) / 100;
      }

      this.createSvg();
    }
  }
  category = ''
  createSvg() {
    d3.select(`#my_violinplot_${this.plotNum}`)
      .selectAll('svg')
      .remove()
      .exit()

    // set the dimensions and margins of the graph
    var margin = { top: 50, right: 30, bottom: 120, left: 120 },
      width = 460 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(`#my_violinplot_${this.plotNum}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Build and Show the Y scale
    var y = d3.scaleLinear()
      // .domain([this.vpMin, this.vpMax])          // Note that here the Y scale is set manually
      .domain([this.minYRange, this.maxYRange])
      .range([height, 0])
    // svg.append("g").call(d3.axisLeft(y))
    svg.append("g")
      .call(this.logCheckbox ? d3.axisLeft(y).tickFormat(d => `${Math.pow(2, +d).toLocaleString()}`) : d3.axisLeft(y));


    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3.scaleBand()
      .range([0, width])
      .domain(this.categoryArr)
      .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .call(wrap, width / (this.categoryArr.length * 2))
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "translate(-20,0)rotate(-65)")

    // Features of the histogram
    var histogram = d3.histogram()
      // .domain([this.vpMin, this.vpMax])
      .domain([this.minYRange, this.maxYRange])
      // .domain(y.domain())
      .thresholds(y.ticks(parseInt(this.numberOfBins)))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
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

    if (!this.maxValue) { //MAYBE CHANGE THIS CONDITION FOR THE FIRST VIOLIN PLOT
      this.maxValue = maxNum
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-this.maxValue * 2.5, this.maxValue * 2.5])

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

    // svg.append("text")
    //   .attr("x", (width / 2)) // Center the text horizontally
    //   .attr("y", 0 - (margin.top / 2) + 15) // Position it above the top margin
    //   .attr("text-anchor", "middle") // Center-align the text horizontally
    //   .style("font-size", "12px") // Set the font size
    //   .text(this.dataDictionary[this.selectedCategory] !== undefined ? (this.dataDictionary[this.selectedCategory][this.category] === undefined ? this.category : this.dataDictionary[this.selectedCategory][this.category]) : 'Violin Plot');

    svg.append("text")
      .attr("transform", "rotate(-90)") // Rotate the text to make it vertical
      .attr("y", 0 - margin.left) // Position it to the left of the left margin
      .attr("x", 0 - (height / 2)) // Position it in the middle of the height
      .attr("dy", "1em") // Adjust the vertical position
      .style("font-size", "10px")
      .style("text-anchor", "middle") // Center-align the text
      .text(this.yAxisLabel === undefined ? "Mitochondrial Counts" : this.yAxisLabel);

    svg
      .append('text')
      .classed('label', true)
      .attr("font-weight", "bold")
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .style('fill', 'rgba(0,0,0,.8)')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .text(this.xAxisLabel === undefined ? '' : this.xAxisLabel);

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
