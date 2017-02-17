var margin = {top: 50, right: 20, bottom: 50, left: 20},
      diffPlotWidth = 240,
      diffPlotHeight = 350,
      xRoundBands = 0.3,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      zValue = function(d) { return d[2]; },
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      yAxis = d3.svg.axis().scale(yScale).orient("left"),
      xAxis = d3.svg.axis().scale(xScale);

var questionVisArray = [];
var gLayer1;
var gLayer2;
var g;

// Creates a new diffPlot svg
function generateNewDiffplot(data){
  // Map the values
  data = data.map(function(d, i, p) {
    return [xValue.call(data, d, i), yValue.call(data, d, i), zValue.call(data, d, i)];
  });
    // Update the x-scale.
  xScale
    .domain(data.map(function(d) { return d[0];} ))
    .rangeRoundBands([0, diffPlotWidth+10], xRoundBands);
  // Update the y-scale.
  yScale
    .domain([0, 200])
    .range([diffPlotHeight/2, -diffPlotHeight/2])
    .nice();
  // Select the svg element, if it exists.
  diffVis = d3.select("#questionVisualiserContent").append("svg:svg")
        .attr("width", diffPlotWidth)
        .attr("height", diffPlotHeight)
        .attr("class", "nano-content")
        .attr("class", "diffPlot col-lg-4 col-md-12")
        .attr("min-width", diffPlotWidth+40)
        .style("overflow", "visible")
        .on ("mouseover", function(d){
          d3.select(this).style({opacity:'0.8'})
          d3.select(this).style({cursor: 'pointer'})
        })
        .on ("mouseout", function(){
          d3.select(this).style({opacity:'1'})
        })
        .on('mousedown', function(d,i){        

        });
      // SHADOWS //
      var defs = diffVis.append( 'defs' );
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
  gLayer1 = diffVis.append("svg:g")
      .append("g").attr("class", "bars")
  gLayer2 = diffVis.append("svg:g")
      .append("g").attr("class", "x axis zero");
  // Update the inner dimensions.
  g = diffVis.select("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");
    questionVisArray.push(diffVis);
}

// Creates all the diffPlots with the given data
function createDiffPlots(allData, codebook){
  // We create diffplots for all questions
  for(var q = 0; q < codebook.length; q++){
    var hasGeneratedNewSvg = false;
    // Our usable data array, it makes an array of answers, differences and questions
    var filteredData = [];
    for(var i = 0; i < Object.keys(allData[1].questions[q].diff).length; i++){
      filteredData.push([Object.keys(allData[1].questions[q].diff)[i], allData[1].questions[q].diff[Object.keys(allData[1].questions[q].diff)[i]], allData[1].questions[q].question])
    }
    // If the svg is not created yet, create it
    if(questionVisArray.length <= q) {
      generateNewDiffplot(filteredData);
      hasGeneratedNewSvg = true;
    }
    else{
      diffVis = questionVisArray[q];
    }
    updateDiffPlotData(allData, filteredData, q, diffVis, codebook, hasGeneratedNewSvg);
  }
}

// Updates the data on the diffPlot
function updateDiffPlotData(allData, filteredData, q, diffV, codebook, generateHeader){
  // Update the x-scale.
  xScale
    .domain(filteredData.map(function(d) { return d[0];} ))
    .rangeRoundBands([0, diffPlotWidth+10], xRoundBands);
  // Update the y-scale.
  yScale
    .domain([0, 200])
    .range([diffPlotHeight/2, -diffPlotHeight/2])
    .nice();
  // Some wierd hack that fixes an unknown unsolvable bugg
  var qtest = q;
  // Create the answer tips
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
  if(generateHeader){
    // Create the question tip
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
  // Create the question subject text
  var text = diffVis.selectAll("text").data([codebook[q].id]);
    text.enter().append("text");
  // Set the display info
  var textLabels = text
    .attr('class', 'questionLabel')
    .attr('class', 'noselect')
    .attr("text-anchor", "middle")
    .attr("x", function(d) { return diffPlotWidth/2; })                
    .attr("y", function(d) { return -30; })
    .text( function (d) { return codebook[q].subject; })
    .attr("font-family", "Open Sans")
    .attr("fill", "#FFCA00")
    .attr("font-size", "16px")
    .attr("text-align", "center");
    textLabels.call(questionTip);
    textLabels.on('mouseover', questionTip.show);
    textLabels.on('mouseout', questionTip.hide);
  }

  // Update the bars.
  var bar = diffVis.select(".bars").selectAll(".bar").data(filteredData);
  bar.enter().append("rect");
  bar.attr("filter", "url(#simpleDiffPlotShadow)");
  bar.exit().remove();
  bar.attr("class", function(d, i) { return d[1] < 0 ? "bar negative" : "bar positive"; })
     .transition()
     .duration(500)
     .style("fill", function (d) {
        return d[1] < 0 ? "#D3000C" : "#30C02C";
    })
     .attr("x", function(d) { return X(d); })
     .attr("y", function(d, i) {
        return (d[1] == "nodata") ? 0 : (d[1] < 0) ? Y0() : Y(d)
     })
     .style()
     .attr("width", xScale.rangeBand())
     .attr("height", function(d, i) { 
        return Math.abs( Y(d) - Y0() ); 
     });
  bar.call(tip);
  bar.on('mouseover', tip.show);
  bar.on('mouseout', tip.hide);

  // x axis at the bottom of the chart
  diffVis.select(".x.axis")
        .attr("font-family", "Open Sans")
        .attr("font-size", "16px")
        .attr("transform", "translate(0," + (diffPlotHeight/2) + ")")
        .attr("fill", "#75C9FF")
        .call(xAxis.orient("bottom"));
}

// Removes all diff plots
function removeAllDiffPlots(){
  questionVisArray = [];
  d3.selectAll('.diffPlot').selectAll('g').remove();
  $(".diffPlot").remove();
  $(".d3-tip").remove();
  $(".questionLabel").remove();
}

// The x-accessor for the path generator; xScale ∘ xValue.
function X(d) {
  return xScale(d[0]);
}

// The y-accessor
function Y0() {
  return (diffPlotHeight/2);
}

// The x-accessor for the path generator; yScale ∘ yValue.
function Y(d) {
  if(d[1] == "nodata"){
    return 0;
  }
  return yScale(d[1]);
}