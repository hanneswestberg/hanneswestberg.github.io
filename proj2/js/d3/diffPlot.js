var margin = {top: 50, right: 20, bottom: 50, left: 20},
      diffPlotWidth = 240,
      diffPlotHeight = 350,
      xRoundBands = 0.5,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      yAxis = d3.svg.axis().scale(yScale).orient("left"),
      xAxis = d3.svg.axis().scale(xScale);
      

function createDiffPlots(allData, codebook){

    //console.log(allData);

    var usableData = [];

    for(var i = 0; i < Object.keys(allData[1].questions[0].diff).length; i++){
      usableData.push([Object.keys(allData[1].questions[0].diff)[i], allData[1].questions[0].diff[Object.keys(allData[1].questions[0].diff)[i]]])
    }

    for(var i = 0; i < 1; i++){

    // Convert data to standard representation greedily;
    // this is needed for nondeterministic accessors.
    usableData = usableData.map(function(d, i) {
      return [xValue.call(usableData, d, i), yValue.call(usableData, d, i)];
    });
  
    // Update the x-scale.
    xScale
        .domain(usableData.map(function(d) { return d[0];} ))
        .rangeRoundBands([0, diffPlotWidth], xRoundBands);
       

    // Update the y-scale.

    //d3.extent(usableData.map(function(d) { return d[1];} ))
    yScale
        .domain([0, 100])
        .range([diffPlotHeight/2, -diffPlotHeight/2]);
        //.nice();
        

    // Select the svg element, if it exists.

    
    var svg = d3.select("#questionVisualiserContent").append("svg");
    //svg.attr("class", "diffPlot");
    svg.attr("class", "diffPlot col-md-4 col-sm-6 col-xs-12")
    svg.style("overflow", "visible");

    // SHADOWS //

    var defs = svg.append( 'defs' );

    // append filter element
    var filter = defs.append( 'filter' )
          .attr( 'id', 'simpleDiffPlotShadow' ); /// !!! important - define id to reference it later

    // append gaussian blur to filter
    filter.append( 'feGaussianBlur' )
          .attr( 'in', 'SourceAlpha' )
          .attr( 'stdDeviation', 12 ) // !!! important parameter - blur
          .attr( 'result', 'blur' );

    // append offset filter to result of gaussion blur filter
    filter.append( 'feOffset' )
          .attr( 'in', 'blur' )
          .attr( 'dx', 3 ) // !!! important parameter - x-offset
          .attr( 'dy', 4 ) // !!! important parameter - y-offset
          .attr( 'result', 'offsetBlur' );

    // merge result with original image
    var feMerge = filter.append( 'feMerge' );

    // first layer result of blur and offset
    feMerge.append( 'feMergeNode' )
           .attr( 'in", "offsetBlur' )

    // original image on top
    feMerge.append( 'feMergeNode' )
           .attr( 'in', 'SourceGraphic' );

    // SHADOWS //

    // Otherwise, create the skeletal chart.
    var gEnter = svg.append("g");
    gEnter.append("g").attr("class", "bars");
    //gEnter.append("g").attr("class", "y axis");
    //gEnter.append("g").attr("class", "x axis");
    gEnter.append("g").attr("class", "x axis zero");

    // Update the outer dimensions.
    svg .attr("width", diffPlotWidth)
        .attr("height", diffPlotHeight);

    // Update the inner dimensions.
    var g = svg.select("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          if(d[1] < 0)
            return "<p>They answered:<p/><br><strong style='color:yellow'>" + codebook[0].answers[d[0]] + ": </strong> <span style='color:red'>   " + Number(d[1]).toFixed(2) + " % less</span><p><br>" + allData[0].name + ":  " + allData[0].questions[0].ans[d[0]] + " %</p><p>" + allData[1].name + ": " + allData[1].questions[0].ans[d[0]] + " %</p>";
          else
            return "<p>They answered:<p/><br><strong style='color:yellow'>" + codebook[0].answers[d[0]] + ": </strong> <span style='color:#2aa02a'>   +" + Number(d[1]).toFixed(2) + " % more</span><p><br>" + allData[0].name + ":  " + allData[0].questions[0].ans[d[0]] + " %</p><p>" + allData[1].name + ": " + allData[1].questions[0].ans[d[0]] + " %</p>";
  })


    var questionTip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            var retString = "<p><strong style='color:yellow'>Wording: </strong>" + codebook[0].wording + "<p/>";

            for(var i = 0; i < Object.keys(codebook[0].answers).length; i++){
              retString = retString.concat("<p> <strong style='color:yellow'>" + Object.keys(codebook[0].answers)[i] + ":</strong> " + codebook[0].answers[Object.keys(codebook[0].answers)[i]] + "</p>");
            }

            return retString;
    })

    var text = svg.selectAll("text")
      .data(codebook[0].subject)
      .enter()
      .append("text");

    var textLabels = text
      .attr('class', 'questionLabel')
      .attr("x", function(d) { return 0; })                
      .attr("y", function(d) { return -30; })
      //.html(function(d) { return "<h2>" + codebook[0].subject + "</h2>"; })
      .text( function (d) { return codebook[0].subject; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white");
    textLabels.call(questionTip);
    textLabels.on('mouseover', questionTip.show);
    textLabels.on('mouseout', questionTip.hide);



   // Update the bars.
    var bar = svg.select(".bars").selectAll(".bar").data(usableData);
    bar.enter().append("rect");
    bar.attr("filter", "url(#simpleDiffPlotShadow)");
    bar.exit().remove();
    bar .attr("class", function(d, i) { return d[1] < 0 ? "bar negative" : "bar positive"; })
        .attr("x", function(d) { return X(d); })
        .attr("y", function(d, i) { return d[1] < 0 ? Y0() : Y(d); })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d, i) { 
          //console.log(Math.abs( Y(d) - Y0() ));
          return Math.abs( Y(d) - Y0() ); 
        });
    bar.call(tip);
    bar.on('mouseover', tip.show);
    bar.on('mouseout', tip.hide);

  // x axis at the bottom of the chart
   g.select(".x.axis")
      .attr("transform", "translate(0," + (diffPlotHeight/2) + ")")
      .call(xAxis.orient("bottom"));
  
  // zero line
   g.select(".x.axis.zero")
      .attr("transform", "translate(0," + Y0() + ")")
      .call(xAxis.tickFormat("").tickSize(0));
  
  
    // Update the y-axis.
    g.select(".y.axis")
      .call(yAxis);
          
    }
  }

  function removeAllDiffPlots(){
    d3.selectAll('.diffPlot').selectAll('g').remove();
    $(".diffPlot").remove();
    $(".d3-tip").remove();
    $(".questionLabel").remove();
  }


// The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  function Y0() {
    return (diffPlotHeight/2);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    //console.log(yScale(d[1]));
    return yScale(d[1]);
  }