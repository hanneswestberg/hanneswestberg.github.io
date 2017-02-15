var width = 700,//Math.max(document.documentElement.clientWidth, window.innerWidth || 0)/1.5, // 700
    height = 700,//Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/1.5, // 700
    radius = Math.min(width, height) / 2;

var startAngle;
var tweenDuration = 1050;
var currentData = [];
var oldPieData = [];
var rootData = [];
var originCountry = "";
var allObjects = [];

// Selection
var selectedCountry = "";
var selectedObject = {};

// Filtering
var filteredObjects = [];
var filteredNames = [];
var isDraging = false;
var isOnRoot;


//var color = d3.scale.category20()
var color = d3.scale.ordinal()
  .domain(["europe", "asia", "africa", "north america", "south america", "oceania"])
  .range(["#1f77b4", "#ff7f0e" , "#2ca02c", "#9467bd", "#8c564b" , "#d62728"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 100);

var pie = d3.layout.pie()
    .startAngle(function(){
        //console.log((startAngle * 57.2957795));
        return startAngle;
    })
    .endAngle(function(){
        //console.log(360 - (Math.PI * 2 + startAngle) * 57.2957795);
        return (Math.PI * 2 + startAngle)
    })
    .sort(null)
    .value(function (d) {
      if(d.pop == "nodata" || d.pop == 0){
        console.log("Missing population data for " + d.name);
        return logValue(minLogValue);
      }
      else{
        //console.log(d.name + "  " + logValue(d.pop));
        return logValue(d.pop);      
      }
});


var logValue = d3.scale.log ()
    .base(Math.E)
    .domain([Math.exp(0), Math.exp(9)])
    .range([2, 10]);

var minLogValue = 10000;



function calculateStartAngle(data){
    var originPop = 0;
    var totalPop = 0;

    originPop = (data[0].pop == "nodata" || data[0].pop == 0) ? logValue(minLogValue) : logValue(data[0].pop);

    for (var i = 0; i < data.length; i++) {
      totalPop += (data[i].pop == "nodata" || data[i].pop == 0) ? logValue(minLogValue) : logValue(data[i].pop);
    }

    var quota = originPop / totalPop;
    startAngle = -(quota * Math.PI * 2) / 2;

    return startAngle;
}

function sortCorrect(unSortedData){
    var ourOwnData = unSortedData.slice();
    // We save the origin country
    var oCountry = ourOwnData[0];
    // Then we remove the first index
    ourOwnData.splice(0, 1);
    // Then sort the data
    var sorted = ourOwnData.sort(function(a, b){
        return a.diff - b.diff;
    });
    // Create needed temp arrays
    var arr1 = [];
    var arr2 = [];
    var newSorted = [];
    // Split the sorted array in half, by odd and even index
    for (var i = 0; i < sorted.length; i++) {
        if(i % 2 == 0){
            arr1.push(sorted[i]);
        }
        else{
            arr2.push(sorted[i]);
        }
    }
    // Add the origin country as first index
    newSorted.push(oCountry);
    // Add the entire first temp array
    for (var i = 0; i < arr1.length; i++) {
        newSorted.push(arr1[i]);
    }
    // Add the reversed second temp array
    for (var i = arr2.length-1; i >= 0; i--) {
        newSorted.push(arr2[i]);
    }
    return newSorted;
}

var paths;
var vis;
var arc_group;

function generateNewSvg(){
  vis = d3.select("#countryVisualizer").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "pieChart")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  arc_group = vis.append("svg:g")
      .attr("class", "arc")
      .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    // SHADOWS //
    var defs = vis.append( 'defs' );
    var filter = defs.append( 'filter' )
          .attr( 'id', 'simpleChartShadow' );
    filter.append( 'feGaussianBlur' )
          .attr( 'in', 'SourceAlpha' )
          .attr( 'stdDeviation', 5 ) // !!! important parameter - blur
          .attr( 'result', 'blur' );
    filter.append( 'feOffset' )
          .attr( 'in', 'blur' )
          .attr( 'dx', 0 ) // !!! important parameter - x-offset
          .attr( 'dy', 0 ) // !!! important parameter - y-offset
          .attr( 'result', 'offsetBlur' );
    var feMerge = filter.append( 'feMerge' );
    feMerge.append( 'feMergeNode' )
           .attr( 'in', 'offsetBlur' )
    feMerge.append( 'feMergeNode' )
           .attr( 'in', 'SourceGraphic' );
}

function createPieChart(data, isRootData){
    // If we need to regenerate the svg
    if(vis == undefined) generateNewSvg();
    // We must check if we are to display root data or filtered data
    if(isRootData == true) {
      rootData = data;
      isOnRoot = true;
      $("#goToRootArrow").css('display', 'none');
    }else{
      if(isOnRoot == true){
      $("#goToRootArrow").css('display', 'inline');
        isOnRoot = false;
      }
    }
    // Set the old pie data, to make them transision out
    oldPieData = pie(currentData);
    // Set this as the origin country
    originCountry = data[0].name;
    // Calculate the right angles of the pie chart to make the origin country symetrical at the top of the chart
    calculateStartAngle(data);
    // Correctly sort the data to make the largest differance appear on the opposite side of the pie chart
    currentData = sortCorrect(data);

    // Give data to svg
    paths = arc_group.selectAll("path").data(pie(currentData));
    paths.enter().append("svg:path")
      .attr("filter", "url(#simpleChartShadow)")
      .attr("stroke", "white")
      .attr("stroke-width", 0)
      .attr("d", arc)
      .style("fill", function (d) {
            return color(d.data.continent);
      })
      .on ("mouseover", function(d){
        // Send info to the controller to display more info about the country the user is hovering over
        if(selectedCountry == "" && angular.element($('#app')).scope().getSelectedCountry() != d.data.name) angular.element('#app').scope().hoverOverCountryCompare(d.data.name);
        // If the user is draging, then add this element to the array of filtered objects
        if(isDraging && !filteredNames.includes(d3.select(this).data()[0].data.name)) {
            filteredObjects.push(d3.select(this));
            filteredNames.push(d3.select(this).data()[0].data.name);
            d3.select(this).style("stroke-width", 3);
        }
        d3.select(this).style({opacity:'0.8'})
        d3.select(this).style({cursor: 'pointer'})
      })
      .on ("mouseout", function(){
        d3.select(this).style({opacity:'1.0'})
      })        
      .on('mousedown', function(d,i){        
        if(selectedCountry == "" && filteredObjects.length <= 1){
            selectedCountry = d.data.name;
            selectedObject = d3.select(this);
            selectedObject.style("stroke-width", 3);
        }
        else {
            selectedObject.style("stroke-width", 0);
            selectedCountry = "";
        }

        if(!filteredNames.includes(d3.select(this).data()[0].data.name)){
          filteredNames.push(d3.select(this).data()[0].data.name);
          filteredObjects.push(d3.select(this));
        }

        isDraging = true;
      })
      .on('mouseup', function(d,i){
        isDraging = false;

        if(filteredObjects.length > 1){
            selectedObject.style("stroke-width", 0);
            selectedCountry = "";

            var newSelectedData = [];
            newSelectedData.push(currentData[0]);
            for (var i = 0; i < filteredObjects.length; i++) {
                filteredObjects[i].style("stroke-width", 0);
                if(currentData[0].name != filteredObjects[i].data()[0].data.name){
                  newSelectedData.push(filteredObjects[i].data()[0].data); 
                  //newSelectedData.push(filteredObjects[i].data()); 
                }
            }

            /*var allOldData = []
            for(var i = 0; i < currentData.length; i++){
              if(!filteredNames.includes(currentData[i].name))
                allOldData.push(currentData[i]);
            }*/
            selectedCountry = "";
            filteredObjects = [];
            filteredNames = [];

            createPieChart(newSelectedData, false);
        }
      })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);
    paths.transition()
        .style("fill", function (d) {
          return color(d.data.continent);
        })
        .duration(tweenDuration)
        .attrTween("d", pieTween);
    paths.exit()
      .transition()
        .duration(tweenDuration)
        .attrTween("d", removePieTween)
      .remove();
}

function removePieChart(){
    vis = undefined;
    d3.select('#pieChart').selectAll('g').remove();
    $("#pieChart").remove();
}



// INTERPOLATION //
function pieTween(d, i) {
  var s0;
  var e0;
  if(oldPieData[i]){
    s0 = oldPieData[i].startAngle;
    e0 = oldPieData[i].endAngle;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    s0 = oldPieData[i-1].endAngle;
    e0 = oldPieData[i-1].endAngle;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
    s0 = oldPieData[oldPieData.length-1].endAngle;
    e0 = oldPieData[oldPieData.length-1].endAngle;
  } else {
    s0 = 0;
    e0 = 0;
  }
  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

function removePieTween(d, i) {
  s0 = 2 * Math.PI;
  e0 = 2 * Math.PI;
  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}
