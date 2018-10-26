/////////////////////////////////////
///reusable code starts here
////////////////////////////////////

var Bar_Graph = function(opt,orientation='vertical') {
  this.data = opt.data;
  this.element = opt.element;
  this.orientation = orientation;
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
  if(this.orientation=='vertical'){
  this.xScale = d3.scaleBand()
    .domain(this.data.map(function(d) {
      return d.x;
    }))
    .range([0, this.width - 2 * this.padding])
  }else if (this.orientation=='horizontal'){
  this.xScale = d3.scaleLinear()
    .domain([0,d3.max(this.data,function(d){
      return d.y;
    })*1.2])
    .range([0, this.width - 2 * this.padding])
  };

  this.xAxis = d3.axisBottom().scale(this.xScale);
};

Bar_Graph.prototype.generateYScale = function() {
  if(this.orientation =='vertical'){
  this.yScale = d3.scaleLinear()
    .domain([0, d3.max(this.data, function(d) {
      return d.y ;
    }) * 1.2])
    .range([this.height - 2 * this.padding, 0])
}else if(this.orientation=='horizontal'){
  this.yScale = d3.scaleBand()
    .domain(this.data.map(function(d) {
      return d.x;
    }))
    .range([this.height - 2 * this.padding, 0]);
}
    this.yAxis = d3.axisLeft().scale(this.yScale);
};

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

  if(this.orientation == 'vertical'){
      var that = this;

      var rect = this.plot.selectAll("rect")
        .data(this.data);

      //remove any elements that don't have data
      rect.exit().remove();

      //update elements that do have Data
      rect
        .transition().duration(this.speed)
        .attr("x", function(d) {
          return that.xScale(d.x)
        })
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
        .attr("x", 0)
        .attr("y", 0)
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
        });
    }else if (this.orientation =='horizontal'){
      var that = this;

      var rect = this.plot.selectAll("rect")
        .data(this.data);

      //remove any elements that don't have data
      rect.exit().remove();

      //update elements that do have Data
      rect
        .transition().duration(this.speed)
        .attr("x", 1)
        .attr("y", function(d) {
          return that.yScale(d.x)
        })
        .attr("height", 0.90 * (this.height - 2 * this.padding) / this.data.length)
        .attr("width", function(d){
        return that.xScale(d.y);
        })
        .attr("fill", function(d) {
          return that.colorScale(d.x)
        })

      //create new elements for data that is new
      rect.enter().append("rect")
        .attr("x", 1)
        .attr("y", function(d) {
          return that.yScale(d.x) + 5
        })
        .on("mouseover", function(d) {
          that.showToolTip(d)
        })
        .on("mouseout", function(d) {
          that.hideToolTip(d)
        })
        .transition().duration(this.speed) // start at "y=0" then transition to the top of the grpah while the height increases
        .attr("y", function(d) {
          return that.yScale(d.x)
        })
        .attr("height", 0.90 * (this.height - 2 * this.padding) / this.data.length)
        .attr("width", function(d) {
          return that.xScale(d.y) ;
        })
        .attr("fill", function(d) {
          return that.colorScale(d.x)
        });

  }

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

  if (this.tooltipNode != undefined) {
    this.tooltipNode.remove()
  };

  this.tooltipNode = this.plot.append("g")


  this.tooltipNode.append("text")
    .attr("id","tooltiptext")
    .attr("opacity",1)
    .attr("x", "0.5em")
    .text(d.x + " | "+ d.y );

  var text_width = d3.select("#tooltiptext").node().getComputedTextLength()+15;
  if(this.orientation == 'vertical'){

    this.tooltipNode
      .attr("transform", "translate(" + (this.xScale(d.x) * 1 + 5) + "," + (this.yScale(d.y) * 1 - 10) + ")")
      .style("opacity", 0);
  }else if(this.orientation == 'horizontal'){
    this.tooltipNode
      .attr("transform", "translate(" + Math.min(this.xScale(d.y)+5,this.xScale(d.y)+5-text_width) + "," + (this.yScale(d.x) * 1 - 10) + ")")
      .style("opacity", 0);

  };

  this.tooltipNode
    .append("rect")
    .attr("width", text_width)
    .attr("height", "1.6em")
    .attr("y", "-1.25em")
    .attr("fill", "lightgray")
    .attr("rx", 4)
    .style("pointer-events", "none");

  this.tooltipNode.append("text")
    .attr("x", "0.5em")
    .style("opacity",0.9)
    .style("background", "lightgray")
    .text(d.x + " | "+ d.y +"mm");

  this.tooltipNode
    .transition().duration(200)
    .style("opacity", 1);

};

Bar_Graph.prototype.hideToolTip = function() {
  var that = this;
  that.tooltipNode.remove();
};

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
  d3.select(".button-container").append("button")
    .text("Sort asc")
    .on("click", function() {
      that.sortAsc()
    });
  d3.select(".button-container").append("button")
    .text("Sort desc")
    .on("click", function() {
      that.sortDesc()
    });
  d3.select(".button-container").append("button")
    .text("Rotate Chart")
    .on("click", function() {
      that.rotateChart()
    });



};

Bar_Graph.prototype.removeData = function() {
  this.data.pop();
  this.updateBars();

};

Bar_Graph.prototype.sortAsc = function(){
  this.data.sort(function(a,b){
    return a.y-b.y;
  });
  this.updateBars();


};

Bar_Graph.prototype.sortDesc = function(){
  this.data.sort(function(a,b){
    return b.y-a.y;
  });
  this.updateBars();


};

Bar_Graph.prototype.rotateChart= function(){
  if(this.orientation=='vertical'){
    this.orientation='horizontal';
  }else{
    this.orientation='vertical';
  };
  this.updateBars();


};
