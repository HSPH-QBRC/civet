import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';


@Component({
  selector: 'app-violinplot',
  templateUrl: './violinplot.component.html',
  styleUrls: ['./violinplot.component.scss']
})
export class ViolinplotComponent implements OnInit {
  @Input() receivedData
  data = [
    {
      Sepal_Length: 5.1,
      Sepal_Width: 3.5,
      Petal_Length: 1.4,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.9,
      Sepal_Width: 3,
      Petal_Length: 1.4,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.7,
      Sepal_Width: 3.2,
      Petal_Length: 1.3,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.6,
      Sepal_Width: 3.1,
      Petal_Length: 1.5,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 5,
      Sepal_Width: 3.6,
      Petal_Length: 1.4,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 5.4,
      Sepal_Width: 3.9,
      Petal_Length: 1.7,
      Petal_Width: 0.4,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.6,
      Sepal_Width: 3.4,
      Petal_Length: 1.4,
      Petal_Width: 0.3,
      Species: "setosa"
    },
    {
      Sepal_Length: 5,
      Sepal_Width: 3.4,
      Petal_Length: 1.5,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.4,
      Sepal_Width: 2.9,
      Petal_Length: 1.4,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.9,
      Sepal_Width: 3.1,
      Petal_Length: 1.5,
      Petal_Width: 0.1,
      Species: "setosa"
    },
    {
      Sepal_Length: 5.4,
      Sepal_Width: 3.7,
      Petal_Length: 1.5,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.8,
      Sepal_Width: 3.4,
      Petal_Length: 1.6,
      Petal_Width: 0.2,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.8,
      Sepal_Width: 3,
      Petal_Length: 1.4,
      Petal_Width: 0.1,
      Species: "setosa"
    },
    {
      Sepal_Length: 4.3,
      Sepal_Width: 3,
      Petal_Length: 1.1,
      Petal_Width: 0.1,
      Species: "setosa"
    },
    {
      Sepal_Length: 5.8,
      Sepal_Width: 4,
      Petal_Length: 1.2,
      Petal_Width: 0.2,
      Species: "setosa"
    }
  ]

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }

  bins = []
  idValue = 'my_dataviz'
  createSvg() {
    d3.select(`#${this.idValue}`)
      .selectAll('svg')
      .remove()
      .exit()

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(`#${this.idValue}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Build and Show the Y scale
    var y = d3.scaleLinear()
      .domain([0, 80])          // Note that here the Y scale is set manually
      .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3.scaleBand()
      .range([0, width])
      .domain(["setosa", "versicolor", "virginica"])
      .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    // Features of the histogram
    var histogram = d3.histogram()
      .domain([0, 50])
      .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d)

    // Compute the binning for each group of the dataset
    // let sumstat = d3.group()  // nest function allows to group the calculation per level of a factor
    //   // .key((d) => { return d['Species']; })
    //   .rollup(function (d) {   // For each key..
    //     console.log("d: ", d)
    //     // this.inputTest = d.map((g)=> { return g['Sepal_Length'] }) 
    //     // console.log("input test: ", this.inputTest)   // Keep the variable called Sepal_Length
    //     this.bins = histogram([1,2,3,2,1,2,2,222,3])   // And compute the binning on it.
    //     return this.bins
    //   })
    //   .entries(this.data)
    var groupedData = Array.from(d3.group(this.data, (d) => d['Species']), ([key, value]) => ({ key, value }));

    var sumstat = groupedData.map((group) => ({
      key: group.key,
      value: histogram(group.value.map((d) => d['Sepal_Length'])), // Modify this line to suit your data
    }));

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 50
    // for (let i in sumstat) {
    //   allBins = sumstat[i].value
    //   lengths = allBins.map(function (a) { return a.length; })
    //   longuest = d3.max(lengths)
    //   if (longuest > maxNum) { maxNum = longuest }
    // }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum])

    // Add the shape to this svg!
    svg
      .selectAll("my_dataviz")
      .data(sumstat)
      .enter()        // So now we are working group per group
      .append("g")
      .attr("transform", function (d) { return ("translate(" + x(d.key) + " ,0)") }) // Translation on the right to be at the group position
      .append("path")
      .datum(function (d) { return (d.value) })     // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill", "#69b3a2")
      //@ts-ignore
      .attr("d", d3.area()
        .x0(function (d) { return (xNum(-d.length)) })
        .x1(function (d) { return (xNum(d.length)) })
        .y(function (d) { return (y(d['x0'])) })
        .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
      )
    // })
  }
}
