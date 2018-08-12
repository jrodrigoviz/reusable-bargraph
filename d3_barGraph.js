/////////////////////////////////////
///reusable code starts here
////////////////////////////////////

var Bar_Graph = function(opt) {
  this.data = opt.data;
  this.element = opt.element;
  this.speed = 1000;
  this.colorPalette = [{
      "color": "#17becf"
    },
    {
      "color": "#bcbd22"
    },
    {
      "color": "#7f7f7f"
    },
    {
      "color": "#e377c2"
    },
    {
      "color": "#8c564b"
    },
    {
      "color": "#9467bd"
    },
    {
      "color": "#d62728"
    },
    {
      "color": "#2ca02c"
    },
    {
      "color": "#ff7f0e"
    },
    {
      "color": "#1f77b4"
    }
  ]
  this.draw();
}


Bar_Graph.prototype.draw = function() {
  this.padding = 50;
  this.width = 1000;
  this.height = 500;

  var svg = d3.select(this.element).append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('padding', this.padding)

  this.plot = svg.append('g')
    .attr('class', 'Bar_Graph_holder')
    .attr('transform', "translate(" + this.padding + "," + this.padding + ")");


  this.generateXScale();
  this.generateYScale();
  this.generateColorScale();
  this.addAxis();
  this.generateButtons();
  this.generateBars();

};

Bar_Graph.prototype.generateXScale = function() {
  this.xScale = d3.scaleBand()
    .domain(this.data.map(function(d) {
      return d.x;
    }))
    .range([0, this.width - 2 * this.padding]);

  this.xAxis = d3.axisBottom().scale(this.xScale);
}

Bar_Graph.prototype.generateYScale = function() {
  this.yScale = d3.scaleLinear()
    .domain([0, d3.max(this.data, function(d) {
      return d.y * 1;
    }) * 1.2])
    .range([this.height - 2 * this.padding, 0]);
  this.yAxis = d3.axisLeft().scale(this.yScale);

}

Bar_Graph.prototype.generateColorScale = function() {
  this.colorScale = d3.scaleOrdinal()
    .domain(this.data.map(function(d) {
      return d.x;
    }))
    .range(this.colorPalette.map(function(d) {
      return d.color;
    }));

}


Bar_Graph.prototype.addAxis = function() {
  this.plot.append("g")
    .attr("id", "x-axisGroup")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + "0" + "," + (this.height - 2 * this.padding) + ")");

  this.plot.select(".x-axis")
    .transition()
    .duration(1000)
    .call(this.xAxis)

  this.plot.append("g")
    .attr("id", "y-axisGroup")
    .attr("class", "y-axis")
    .attr("transform", "translate(0,0)");

  this.plot.select(".y-axis")
    .transition()
    .duration(1000)
    .call(this.yAxis)

}

Bar_Graph.prototype.updateAxis = function() {
  this.plot.select(".x-axis")
    .transition()
    .duration(1000)
    .call(this.xAxis)

  this.plot.select(".y-axis")
    .transition()
    .duration(1000)
    .call(this.yAxis)

}


Bar_Graph.prototype.generateBars = function() {
  var that = this;

  var rect = this.plot.selectAll("rect")
    .data(this.data);

  //remove any elements that don't have data
  rect.exit().remove();

  //update elements that do have Data
  rect
    .attr("x", function(d) {
      return that.xScale(d.x)
    })
    .attr("y", this.height - 2 * this.padding)
    .attr("height", 0) // start at "y=0" then transition to the top of the grpah while the height increases
    .transition().duration(this.speed)
    .attr("y", function(d) {
      return that.yScale(d.y)
    })
    .attr("height", function(d) {
      return that.height - that.yScale(d.y) - 2 * that.padding;
    })
    .attr("width", 0.90 * (this.width - 2 * this.padding) / this.data.length)
    .attr("fill", function(d) {
      return that.colorScale(d.x)
    })

  //create new elements for data that is new
  rect.enter().append("rect")
    .attr("x", function(d) {
      return that.xScale(d.x) + 5
    })
    .attr("y", this.height - 2 * this.padding)
    .on("mouseover", function(d) {
      that.showToolTip(d)
    })
    .on("mouseout", function(d) {
      that.hideToolTip(d)
    })
    .transition().duration(this.speed) // start at "y=0" then transition to the top of the grpah while the height increases
    .attr("y", function(d) {
      return that.yScale(d.y)
    })
    .attr("height", function(d) {
      return that.height - that.yScale(d.y) - 2 * that.padding;
    })
    .attr("width", 0.90 * (this.width - 2 * this.padding) / this.data.length)
    .attr("fill", function(d) {
      return that.colorScale(d.x)
    })

};

Bar_Graph.prototype.updateBars = function() {
  this.generateXScale();
  this.generateYScale();
  this.generateColorScale();
  this.updateAxis();
  this.generateBars();

};


Bar_Graph.prototype.updateData = function() {
  var newEntry = {
    x: "A" + Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100)
  };
  this.data.push(newEntry);
  this.updateBars();
};

Bar_Graph.prototype.showToolTip = function(d) {
  //div tooltip
  /*
   this.tooltipNode =d3.select("body").append("div")
     .html( d.x+"  |  "+"Value:"+d.y)
     .style("position","absolute")
     //.style("width", "60px")
     //.style("height", "28px")
     .style("padding", "5px")
     .style("background", "lightgray")
     .style("border-radius","8px")
     .style("pointer-events","none")
     .style("left",this.xScale(d.x)+2*this.padding+"px")
     .style("top",this.yScale(d.y) +"px")
     .style("opacity",0)

   this.tooltipNode
     .transition().duration(500)
     .style("opacity",0.9)

  */

  if (this.tooltipNode != undefined) {
    this.tooltipNode.remove()
  };

  this.tooltipNode = this.plot.append("g")
    .attr("transform", "translate(" + (this.xScale(d.x) * 1 + 5) + "," + (this.yScale(d.y) * 1 - 10) + ")")
    .style("opacity", 0)

  this.tooltipNode
    .append("rect")
    .attr("width", String(d.x + " | Value:" + d.y).length * 8.2) //8.2 as a proxy of char length to calculate tooltip box width
    .attr("height", "1.6em")
    .attr("y", "-1.25em")
    .attr("fill", "lightgray")
    .attr("rx", 4)
    .style("pointer-events", "none");


  this.tooltipNode.append("text")
    .attr("x", "0.5em")
    .style("opacity", 0.9)
    .style("background", "lightgray")
    .text(d.x + " | Value:" + d.y);

  this.tooltipNode
    .transition().duration(200)
    .style("opacity", 1);

};

Bar_Graph.prototype.hideToolTip = function() {
  var that = this;
  that.tooltipNode.remove();
}

Bar_Graph.prototype.generateButtons = function() {
  var that = this;
  d3.select(".button-container").append("button")
    .text("Add Bar")
    .on("click", function() {
      that.updateData()
    });
  d3.select(".button-container").append("button")
    .text("Remove Bar")
    .on("click", function() {
      that.removeData()
    });


}

Bar_Graph.prototype.removeData = function() {
  this.data.pop();
  this.updateBars();

};
