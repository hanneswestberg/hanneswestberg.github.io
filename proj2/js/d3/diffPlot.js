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

// Our array of questions, the structure is : { "svg":diffVis, "data":data, "question":question, "type":type }
var questionVisArray = [];
// Reference to all our current data
var currentPlotData = [];

// Creates a new diffPlot svg
function generateNewDiffplot(data, questionID, codebook, type){
  // Map the values
  data = data.map(function(d, i, p) {
      return [xValue.call(data, d, i), yValue.call(data, d, i), zValue.call(data, d, i)];
  });
    // Update the x-scale.
  xScale
    .domain(data.map(function(d) { 
        return d[0];
    }))
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
          d3.select(this).style({cursor: 'pointer'})
        })
        .on('mousedown', function(d,i){
          // First we find the right id
          var id;
          for(var i = 0; i < questionVisArray.length; i++){
            if(questionVisArray[i].svg[0][0] == d3.select(this)[0][0])
              id = i;
          }
          if(questionVisArray[id].type != "groupthey" && questionVisArray[id].type != "they" && questionVisArray[id].type != "self" && questionVisArray[id].type != "nodata"){
            // Then alternate type
            if(questionVisArray[id].type == "group" || questionVisArray[id].type == "groupab") questionVisArray[id].type = (questionVisArray[id].type == "group") ? "groupab": "group";
            else questionVisArray[id].type = (questionVisArray[id].type == "diff") ? "ab": "diff";
            // Remove all tips
            $(".barstip"+id).remove();
            updateDiffPlotData(filterDataForType(questionVisArray[id].questionID, questionVisArray[id].questionData, questionVisArray[id].type), id, false);
          }
        });
      // SHADOWS //
      var defs = diffVis.append( 'defs' );
      var filter = defs.append( 'filter' )
            .style("z-index", -100)
            .attr("class", "noselect")
            .attr( 'id', 'simpleDiffPlotShadow' ); /// !!! important - define id to reference it later
      filter.append( 'feGaussianBlur' )
            .attr( 'in', 'SourceAlpha' )
            .attr( 'stdDeviation', 7 ) // !!! important parameter - blur
            .attr( 'result', 'blur' );
      filter.append( 'feOffset' )
            .attr( 'in', 'blur' )
            .attr( 'dx', 2 ) // !!! important parameter - x-offset
            .attr( 'dy', 2 ) // !!! important parameter - y-offset
            .attr( 'result', 'offsetBlur' );
      var feMerge = filter.append( 'feMerge' );
      feMerge.append( 'feMergeNode' )
             .attr( 'in", "offsetBlur' )
      feMerge.append( 'feMergeNode' )
             .attr( 'in', 'SourceGraphic' );
  var gLayer1 = diffVis.append("svg:g")
      .append("g").attr("class", "bars")
  var gLayer2 = diffVis.append("svg:g")
      .append("g").attr("class", "x axis zero");
  // Update the inner dimensions.
  var g = diffVis.select("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");
    questionVisArray.push({ "svg":diffVis, "data":data, "questionID":questionID, "questionData":codebook[questionID], "type":type });
}

// Filters the data for the choosen type of visualization
function filterDataForType(questionID, questionData, type){
  var filteredData = [];
  // Our usable data array, it makes an array of answers, differences and questions
  switch(type){
    case "diff":
        for(var i = 0; i < Object.keys(currentPlotData[1].questions[questionID].diff).length; i++){
          filteredData.push([Object.keys(currentPlotData[1].questions[questionID].diff)[i], currentPlotData[1].questions[questionID].diff[Object.keys(currentPlotData[1].questions[questionID].diff)[i]]]);
        }
        break;
    case "groupab":
    case "ab":
        for(var i = 0; i < Object.keys(currentPlotData[0].questions[questionID].ans).length; i++){
          filteredData.push([Object.keys(currentPlotData[0].questions[questionID].ans)[i], currentPlotData[0].questions[questionID].ans[Object.keys(currentPlotData[0].questions[questionID].ans)[i]]]);
        }
        for(var i = 0; i < Object.keys(currentPlotData[1].questions[questionID].ans).length; i++){
          filteredData.push([Object.keys(currentPlotData[1].questions[questionID].ans)[i], currentPlotData[1].questions[questionID].ans[Object.keys(currentPlotData[1].questions[questionID].ans)[i]]]);
        }
        break;
    
    case "group":
        for(var i = 0; i < Object.keys(currentPlotData[1].questions[questionID].diff).length; i++){
          filteredData.push([Object.keys(currentPlotData[1].questions[questionID].diff)[i], (currentPlotData[1].questions[questionID].diff[Object.keys(currentPlotData[1].questions[questionID].diff)[i]] != NaN) ? currentPlotData[1].questions[questionID].diff[Object.keys(currentPlotData[1].questions[questionID].diff)[i]] : 0]);
        }
        break;
    case "self":
        for(var i = 0; i < Object.keys(currentPlotData[0].questions[questionID].ans).length; i++){
          filteredData.push([Object.keys(currentPlotData[0].questions[questionID].ans)[i], currentPlotData[0].questions[questionID].ans[Object.keys(currentPlotData[0].questions[questionID].ans)[i]]]);
        }
        break;
    case "groupthey":
    case "they":
        if(currentPlotData[1].questions[questionID].ans != "nodata" && currentPlotData[1].questions[questionID].ans != undefined){
          for(var i = 0; i < Object.keys(currentPlotData[1].questions[questionID].ans).length; i++){
            filteredData.push([Object.keys(currentPlotData[1].questions[questionID].ans)[i], currentPlotData[1].questions[questionID].ans[Object.keys(currentPlotData[1].questions[questionID].ans)[i]]]);
          }
        }
        else 
          filteredData = ["nodata"];

        break;
    case "nodata":
    default:
        filteredData = ["nodata"];
        break;
  }
  return filteredData;
}

// Generate the tip info for given type
function generateTipInfoForType(barObj, indexInArray, abUpper){
  var type = questionVisArray[indexInArray].type;
  var questionData = questionVisArray[indexInArray].questionData;
  var questionID = questionVisArray[indexInArray].questionID;
  var retString = "";
  var questionOrInfoSuffix = (questionData.type == "question") ? "answered" : questionData.infoSuffix;
  var questionOrInfoUnit = (questionData.type == "question") ? " %" : questionData.unit;
  var questionOrInfoUnitSuffixPos = (questionData.type == "question") ? "more" : questionData.unitSuffixPos;
  var questionOrInfoUnitSuffixNeg = (questionData.type == "question") ? "less" : questionData.unitSuffixNeg;
  switch(type){
    case "diff":
        var posOrNeg = (barObj[1] < 0) ? ("<span style='color:#D3000C'> &#160 " + Number(barObj[1]).toFixed(2) +questionOrInfoUnit+ " "+questionOrInfoUnitSuffixNeg+":") : ("<span style='color:#30C02C'> &#160 +" + Number(barObj[1]).toFixed(2) +questionOrInfoUnit+ " "+questionOrInfoUnitSuffixPos);
        retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[1].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong>" + posOrNeg + "</span><p><strong style='color:#B08062'><br>" + currentPlotData[0].name + ":  </strong> &#160 " + Number(currentPlotData[0].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p><strong style='color:#B08062'><p>" + currentPlotData[1].name + ": </strong> &#160 " + Number(currentPlotData[1].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p>";
        break;
    case "ab":
        if(abUpper)
          retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[0].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
        else
          retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[1].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
        break;
    case "groupab":
        if(abUpper)
          retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[0].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
        else{
          retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[1].name + "</strong> (mean value) "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
          var stopIndex = currentPlotData[2].length;
          if(currentPlotData[2].length > 5){
            stopIndex = 5;
            for(var i = 0; i < stopIndex; i++){
              retString = retString.concat("<p><strong style='color:#B08062'>" + currentPlotData[2][i].name + ":  </strong> &#160 " + Number(currentPlotData[2][i].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p>");
            }
            retString = retString.concat("<br><p>+ " + (currentPlotData[2].length - stopIndex) + " <strong style='color:#B08062'>Other Countries</strong></p>");
          }else{
            for(var i = 0; i < currentPlotData[2].length; i++){
              retString = retString.concat("<p><strong style='color:#B08062'>" + currentPlotData[2][i].name + ":  </strong> &#160 " + Number(currentPlotData[2][i].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p>");
            }
          }
        }
        break;
    case "group":
        var posOrNeg = (barObj[1] < 0) ? ("<span style='color:#D3000C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit+" "+questionOrInfoUnitSuffixNeg+":") : ("<span style='color:#30C02C'> &#160 +" + Number(barObj[1]).toFixed(2) + questionOrInfoUnit+" "+questionOrInfoUnitSuffixPos);
        retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[1].name + "</strong> (mean value) "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong>" + posOrNeg + "</span><p><strong style='color:#B08062'><br>" + currentPlotData[0].name + ":  </strong> &#160 " + Number(currentPlotData[0].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p><strong style='color:#B08062'><p>" + currentPlotData[1].name + ": </strong> &#160 " + Number(currentPlotData[1].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p><br>";
        var stopIndex = currentPlotData[2].length;
        if(currentPlotData[2].length > 5){
          stopIndex = 5;
          for(var i = 0; i < stopIndex; i++){
            retString = retString.concat("<p><strong style='color:#B08062'>" + currentPlotData[2][i].name + ":  </strong> &#160 " + Number(currentPlotData[2][i].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p>");
          }
          retString = retString.concat("<br><p>+ " + (currentPlotData[2].length - stopIndex) + " <strong style='color:#B08062'>Other Countries</strong></p>");
        }else{
          for(var i = 0; i < currentPlotData[2].length; i++){
            retString = retString.concat("<p><strong style='color:#B08062'>" + currentPlotData[2][i].name + ":  </strong> &#160 " + Number(currentPlotData[2][i].questions[questionID].ans[barObj[0]]).toFixed(2) + questionOrInfoUnit+"</p>");
          }
        }
        break;
    case "self":
        retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[0].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
        break;
    case "they":
    default:
        retString = "<p><strong style='color:#B08062'><br>" + currentPlotData[1].name + "</strong> "+questionOrInfoSuffix+":<p/><br><strong style='color:#75C9FF'>" + questionData.answers[barObj[0]] + "</strong><span style='color:#30C02C'> &#160 " + Number(barObj[1]).toFixed(2) + questionOrInfoUnit;
        break;
  }
  return retString;
}

// Creates all the diffPlots with the given data
function createDiffPlots(allData, codebook, questionOrder, type, generateHeaders){
  // Lets remove all left over junk
  $('.nodataLabel').remove();
  currentPlotData = allData;
  // We create diffplots for all questions
  for(var c = 0; c < questionOrder.length; c++){
    // Lets create a header for this category
    if(generateHeaders) $("#questionVisualiserContent").append('<h2 class="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryHeaders" style="color:#75C9FF; font-size: 25px; text-align: center; margin: 0px; top: 30px; height:40px; position: relative; border-bottom: 1px solid #222">' + questionOrder[c].subject + '</h2>');
    // For the questions in the category
    for(var q = 0; q < questionOrder[c].questions.length; q++){
      var hasGeneratedNewSvg = false;
      var thisType = type;
      // If both countries have no data, then show no data
      if(allData[0].questions[questionOrder[c].questions[q]].ans == "nodata" && allData[1].questions[questionOrder[c].questions[q]].ans == "nodata"){ thisType = "nodata"; }
      // If the origin country has data, but not the selected one, then show self, or if the selected country is the origin country
      else if(allData[0].name == allData[1].name || allData[0].questions[questionOrder[c].questions[q]].ans != "nodata" && allData[1].questions[questionOrder[c].questions[q]].ans == "nodata"){ thisType = "self"; }
      // If the selected country has data, but not the origin one, then show they
      else if(allData[0].questions[questionOrder[c].questions[q]].ans == "nodata" && allData[1].questions[questionOrder[c].questions[q]].ans != "nodata"){ thisType = "they"; }
      // If we have data for both countries, we must investigate further which type to display
      else if(allData[0].questions[questionOrder[c].questions[q]].ans != "nodata" && allData[1].questions[questionOrder[c].questions[q]].ans != "nodata"){
        // If we do not have a group, we should check if we should display "ab" or "diff"
        if(type != "group" && type != "groupab"){ thisType = (type == "diff") ? "diff" : "ab"; }
        // We have a group, we check if we should display diff or ab
        else if(type == "group" || type == "groupab"){ thisType = (type == "group") ? "group": "groupab"; }
      }
      

      // Lets first try to find it
      var index = -1;
      for(var i = 0; i < questionVisArray.length; i++){
        if(questionVisArray[i].questionID == questionOrder[c].questions[q]) index = i;
      }
      // If the search failed, the svg is not created yet, we need to create it
      var filteredData = filterDataForType(questionOrder[c].questions[q], codebook[questionOrder[c].questions[q]], thisType);
      if(index == -1) {
        generateNewDiffplot(filteredData, questionOrder[c].questions[q], codebook, thisType);
        hasGeneratedNewSvg = true;
      }else{
        // We might need to update the plot type
        questionVisArray[index].type = thisType;
      }
      $(".barstip"+index).remove();
      updateDiffPlotData(filteredData, (index != -1) ? index : questionVisArray.length-1, hasGeneratedNewSvg);
    }
  }
}

// Updates the data on the diffPlot
function updateDiffPlotData(filteredData, indexInArray, generateHeader){
  // Store the data in smaller more accessable variables
  var diffVis = questionVisArray[indexInArray].svg;
  var questionID = questionVisArray[indexInArray].questionID;
  var questionData = questionVisArray[indexInArray].questionData;
  var type = questionVisArray[indexInArray].type;
  if(type == "nodata" || type == "they" || type == "self"){
    var noDataText = diffVis.append("text");
    // Set the display info
    var textLabels = noDataText
      .attr('class', 'noselect nodataLabel')
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return diffPlotWidth/2; })                
      .attr("y", function(d) {
        if(type == "self" && currentPlotData[0].name != currentPlotData[1].name)
          return diffPlotHeight/2 + 80;
        else
          return diffPlotHeight/2 - 80; 
      })
      .text( function (d) { 
        switch(type){
          case "nodata":
            return "No data in given interval"; 
            break;
          case "they":
            return "No data for "+ currentPlotData[0].name; 
            break;
          case "self":
            if(currentPlotData[0].name != currentPlotData[1].name) 
              return "No data for "+ currentPlotData[1].name;
            else
              return "";
            break;
        }
        
      })
      .attr("font-family", "Open Sans")
      .attr("fill", "#D3000C")
      .attr("font-size", "16px")
      .attr("text-align", "center");
  }

  if(type != "nodata") {
    // Update the x-scale.
    xScale
      .domain(filteredData.map(function(d) { 
        return d[0];
      }))
      .rangeRoundBands([0, diffPlotWidth+10], xRoundBands);
    // Update the y-scale.
    var yScaleMaxValue = (questionData.type == "info") ? (questionData.maxvalue * 2) : 200;
    yScale
      .domain([0, yScaleMaxValue])
      .range([diffPlotHeight/2, -diffPlotHeight/2])
      .nice();
  }
  // Create the answer tips
  var tip = d3.tip()
      .attr('class', 'd3-tip barstip'+indexInArray)
      .direction('n')
      .offset([-10, 0])
      .html(function(d, i) {
        if(type == "ab" || type == "groupab"){
          return generateTipInfoForType(d, indexInArray, (i < (filteredData.length/2)));
        }
        else{
          return generateTipInfoForType(d, indexInArray);
        }
  })


  if(generateHeader){
    // Create the question tip
    var questionTip = d3.tip()
      .attr('class', 'd3-tip')
      .direction('s')
      .offset([10, 0])
      .html(function(d) {
        var retString = (questionData.type == "question") ?  "<p><strong style='color:#FFCA00'>Wording: </strong>" + questionData.wording + "<p/>" : "<p><strong style='color:#FFCA00'>Info: </strong>" + questionData.wording + "<p/>";
        for(var i = 0; i < Object.keys(questionData.answers).length; i++){
          retString = retString.concat("<p> <strong style='color:#75C9FF'>" + Object.keys(questionData.answers)[i] + ":</strong> " + questionData.answers[Object.keys(questionData.answers)[i]] + "</p>");
        }
        return retString;
  })  
  // Create the question subject text
  var text = diffVis.selectAll("text").data([questionData.id]);
    text.enter().append("text");
  // Set the display info
  var textLabels = text
      .attr('class', 'questionLabel')
      .attr('class', 'noselect')
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return diffPlotWidth/2; })                
      .attr("y", function(d) { return -30; })
      .text( function (d) { return questionData.subject; })
      .attr("font-family", "Open Sans")
      .attr("fill", "#FFCA00")
      .attr("font-size", "16px")
      .attr("text-align", "center");
    textLabels.call(questionTip);
    textLabels.on('mouseover', questionTip.show);
    textLabels.on('mouseout', questionTip.hide);
  }


  // Update the bars.
  var bar = diffVis.select(".bars").selectAll(".bar").data((type != "nodata") ? filteredData : 0);
  bar.enter().append("rect")
     .attr("height", 0)
     .attr("y", Y0())
     .style("z-index", 100);
  bar.attr("filter", "url(#simpleDiffPlotShadow)")
     .attr("class", function(d, i) {
      if(isNaN(d[1])) return "bar negative";
        switch(type){
          case "groupab":
          case "ab":
            return "bar positive";
            break;
          case "diff":
          case "self":
          case "group":
            return d[1] < 0 ? "bar negative" : "bar positive"; 
            break;
          case "nodata":
          case "they":
          default:
            return "bar negative";
            break;
        }
    })  
    .transition()
    .duration(500)
    .style("fill", function (d, i) {
    if(isNaN(d[1])) return "#D3000C";
      switch(type){
        case "groupab":
        case "ab":
          // First country
          if(i < (filteredData.length/2)){ 
            return "#30C02C";
          }
          // Second country
          else{
            return "#D3000C";
          }
          break;
        case "diff":
        case "self":
        case "group":
          return d[1] < 0 ? "#D3000C" : "#30C02C";
          break;
        case "nodata":
        case "they":
        default:
          return "#D3000C";
          break;
      }
      })
      .attr("x", function(d) { return X(d); })
      .attr("y", function(d, i) {
        if(isNaN(d[1])) return Y0();
        switch(type){
          case "groupab":
          case "ab":
            // First country
            if(i < (filteredData.length/2)){ 
              return (d[1] == "nodata") ? 0 : Y(d)
            }
            // Second country
            else{
              return (d[1] == "nodata") ? 0 : Y0()
            }
            break;
          case "diff":
          case "self":
          case "group":
            return (d[1] == "nodata") ? 0 : (d[1] < 0) ? Y0() : Y(d);
            break;
          case "they":
            return (d[1] == "nodata") ? 0 : Y0()
            break;
          case "nodata":
          default:
            return Y0();
            break;
        }})
       .attr("width", xScale.rangeBand())
       .attr("height", function(d, i) {
        if(isNaN(d[1])) return 0;
        switch(type){
          case "groupab":
          case "ab":
            // First country
            if(i < (filteredData.length/2)){ 
              return Math.abs( Y(d) - Y0() );
            }
            // Second country
            else{
              return Math.abs( Y0() - Y(d) );
            }
            break;
          case "diff":
          case "self":
          case "group":
            return Math.abs( Y(d) - Y0() );
            break;
          case "they":
            return Math.abs( Y0() - Y(d) );
            break;
          case "nodata":
          default:
            return Y0();
            break;
        }
       });
  bar.exit()
     .transition()
     .duration(500)
     .attr("height", function(d, i) {
        if(isNaN(d[1])) return 0;
        switch(type){
          case "groupab":
          case "ab":
          case "diff":
          case "self":
          case "group":
          case "they":
          case "nodata":
          default:
            return 0;
            break;
        }
        })
        .attr("y", function(d, i) {
        if(isNaN(d[1])) return 0;
        switch(type){
          case "groupab":
          case "ab":
          case "diff":
          case "self":
          case "they":
          case "group":
          case "nodata":
          default:
            return Y0();
            break;
        }})
        .remove();

  if(type != "nodata"){
    bar.call(tip);
    bar.on('mouseover', tip.show);
    bar.on('mouseout', tip.hide);

    // x axis at the bottom of the chart
    diffVis.select(".x.axis")
      .attr("font-family", "Open Sans")
      .attr("font-size", "16px")
      .style("z-index", -100)
      .attr("transform", "translate(0," + (diffPlotHeight/2) + ")")
      .attr("fill", "#75C9FF")
      .call(xAxis.orient("bottom")).selectAll("text")
        //.attr("y", function(d){

        //})
        .attr("z-index", -100)
        .attr("class", "noselect");
        //.attr("dy", ".35em")
        //.style("text-anchor", "center");
  }
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