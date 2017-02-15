var margin = {top: 50, right: 20, bottom: 50, left: 20},
      diffPlotWidth = 240,
      diffPlotHeight = 350,
      xRoundBands = 0.5,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      zValue = function(d) { return d[2]; },
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      yAxis = d3.svg.axis().scale(yScale).orient("left"),
      xAxis = d3.svg.axis().scale(xScale);
      

function createDiffPlots(allData, codebook){

    // We create diffplots for all questions
    for(var q = 0; q < codebook.length; q++){

    var usableData = [];

    for(var i = 0; i < Object.keys(allData[1].questions[q].diff).length; i++){
      usableData.push([Object.keys(allData[1].questions[q].diff)[i], allData[1].questions[q].diff[Object.keys(allData[1].questions[q].diff)[i]], allData[1].questions[q].question])
    }

    //console.log(usableData);

    usableData = usableData.map(function(d, i, p) {
      return [xValue.call(usableData, d, i), yValue.call(usableData, d, i), zValue.call(usableData, d, i)];
    });
  
    // Update the x-scale.
    xScale
        .domain(usableData.map(function(d) { return d[0];} ))
        .rangeRoundBands([30, diffPlotWidth], xRoundBands);
       

    // Update the y-scale.

    //d3.extent(usableData.map(function(d) { return d[1];} ))
    yScale
        .domain([0, 160])
        .range([diffPlotHeight/2, -diffPlotHeight/2])
        .nice();
        

    // Select the svg element, if it exists.
    var svg = d3.select("#questionVisualiserContent").append("svg");
    //svg.attr("class", "diffPlot");
    svg.attr("class", "diffPlot col-lg-4 col-md-12")
    svg.attr("min-width", diffPlotWidth+40)
    svg.style("overflow", "visible");

    // SHADOWS //
    var defs = svg.append( 'defs' );
    var filter = defs.append( 'filter' )
          .attr( 'id', 'simpleDiffPlotShadow' ); /// !!! important - define id to reference it later
    filter.append( 'feGaussianBlur' )
          .attr( 'in', 'SourceAlpha' )
          .attr( 'stdDeviation', 12 ) // !!! important parameter - blur
          .attr( 'result', 'blur' );
    filter.append( 'feOffset' )
          .attr( 'in', 'blur' )
          .attr( 'dx', 3 ) // !!! important parameter - x-offset
          .attr( 'dy', 4 ) // !!! important parameter - y-offset
          .attr( 'result', 'offsetBlur' );
    var feMerge = filter.append( 'feMerge' );
    feMerge.append( 'feMergeNode' )
           .attr( 'in", "offsetBlur' )
    feMerge.append( 'feMergeNode' )
           .attr( 'in', 'SourceGraphic' );

    // Otherwise, create the skeletal chart.
    var gEnter = svg.append("g");
    gEnter.append("g").attr("class", "bars");
    gEnter.append("g").attr("class", "x axis zero");

    // Update the outer dimensions.
    svg .attr("width", diffPlotWidth)
        .attr("height", diffPlotHeight);

    // Update the inner dimensions.
    var g = svg.select("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    var qtest = q;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {

          // A bugg fix that searches for the correct question to display info for
          var myQ = "";
          for(var i = 0; i < codebook.length; i++){
            if(codebook[i].id == d[2])
              myQ = i;
          }

          var posOrNeg = (d[1] < 0) ? ("<span style='color:#D3000C'> &#160 " + Number(d[1]).toFixed(2) + " % less:") : ("<span style='color:#30C02C'> &#160 +" + Number(d[1]).toFixed(2) + " % more");
      
          return "<p>They answered:<p/><br><strong style='color:#75C9FF'>" + codebook[myQ].answers[d[0]] + "</strong>" + posOrNeg + "</span><p><strong style='color:#B09062'><br>" + allData[0].name + ":  </strong> &#160 " + allData[0].questions[myQ].ans[d[0]] + " %</p><strong style='color:#B09062'><p>" + allData[1].name + ": </strong> &#160 " + allData[1].questions[myQ].ans[d[0]] + " %</p>";
  })


    var questionTip = d3.tip()
          .attr('class', 'd3-tip')
          .direction('s')
          .offset([-10, 0])
          .html(function(d) {
          var myQ = "";
          for(var i = 0; i < codebook.length; i++){
            if(codebook[i].id == d)
              myQ = i;
          }
            var retString = "<p><strong style='color:#FFCA00'>Wording: </strong>" + codebook[myQ].wording + "<p/>";
            for(var i = 0; i < Object.keys(codebook[myQ].answers).length; i++){
              retString = retString.concat("<p> <strong style='color:#75C9FF'>" + Object.keys(codebook[myQ].answers)[i] + ":</strong> " + codebook[myQ].answers[Object.keys(codebook[myQ].answers)[i]] + "</p>");
            }
            return retString;
    })

    var text = svg.selectAll("text")
      .data([codebook[q].id])
      .enter()
      .append("text");

    var textLabels = text
      .attr('class', 'questionLabel')
      .attr('class', 'noselect')
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return diffPlotWidth/2; })                
      .attr("y", function(d) { return -30; })
      .text( function (d) { return codebook[q].subject; })
      .attr("font-family", "Open Sans")
      .attr("font-size", "18px")
      .attr("fill", "#FFCA00")
      .attr("text-align", "center");
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
        .attr("y", function(d, i) { 
          if(d[1] == "nodata"){
            return 0;
          }
          else{
            return d[1] < 0 ? Y0() : Y(d);  
          }
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d, i) { 
          return Math.abs( Y(d) - Y0() ); 
        });
    bar.call(tip);
    bar.on('mouseover', tip.show);
    bar.on('mouseout', tip.hide);

  // x axis at the bottom of the chart
   g.select(".x.axis")
      //.attr("class", "axisText")
      .attr("font-family", "Open Sans")
      .attr("font-size", "16px")
      .attr("transform", "translate(0," + (diffPlotHeight/2) + ")")
      .attr("fill", "#75C9FF")
      .call(xAxis.orient("bottom"));
      //
  
  // zero line
   g.select(".x.axis.zero")
      .attr("transform", "translate(0," + Y0() + ")");
      //.call(xAxis.tickFormat("").tickSize(0));
          
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
    if(d[1] == "nodata"){
      return 0;
    }
    //console.log(yScale(d[1]));
    return yScale(d[1]);
  }