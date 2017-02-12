var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2;

var startAngle;
var tweenDuration = 1050;
var sortedData = [];
var oldPieData = [];
var originCountry = "";

// Selection
var selectedCountry = "";
var selectedObject = {};

// Filtering
var filteredObjects = [];
var isDraging = false;


var color = d3.scale.category20()

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
    return d.pop;
});

function sortCorrect(unSortedData){
    // First sort the data
    var sorted = unSortedData.sort(function(a, b){
        return a.diff - b.diff;
    });

    // Create needed temp arrays
    var arr1 = [];
    var arr2 = [];
    var newSorted = [];

    // Split the sorted array in half, by odd and even index
    for (var i = 1; i < sorted.length; i++) {
        if(i % 2 == 0){
            arr1.push(sorted[i]);
        }
        else{
            arr2.push(sorted[i]);
        }
    }

    // Add the origin country as first index
    newSorted.push(sorted[0]);

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


function createPieChart(data){

    // Set this as the origin country
    originCountry = data[0].name;

    // Calculate the right angles of the pie chart to make the origin country symetrical at the top of the chart
    calculateStartAngle(data);

    sortedData = sortCorrect(data);

    var svg = d3.select("#countryVisualizer").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "pieChart")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // SHADOWS //

    var defs = svg.append( 'defs' );

    // append filter element
    var filter = defs.append( 'filter' )
          .attr( 'id', 'simpleChartShadow' ); /// !!! important - define id to reference it later

    // append gaussian blur to filter
    filter.append( 'feGaussianBlur' )
          .attr( 'in', 'SourceAlpha' )
          .attr( 'stdDeviation', 5 ) // !!! important parameter - blur
          .attr( 'result', 'blur' );

    // append offset filter to result of gaussion blur filter
    filter.append( 'feOffset' )
          .attr( 'in', 'blur' )
          .attr( 'dx', 0 ) // !!! important parameter - x-offset
          .attr( 'dy', 0 ) // !!! important parameter - y-offset
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

    var g = svg.selectAll(".arc")
        .data(pie(sortedData))
        .enter().append("g")
        .attr("class", "arc")
        .attr("filter", "url(#simpleChartShadow)"); // !!! important - set id of predefined filter

    g.append("path")
        .attr("stroke-width", 0)
        .attr("stroke", "white")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.continent);
        })
        .on ("mouseover", function(d){
            if(selectedCountry == "" && angular.element($('#app')).scope().getSelectedCountry() != d.data.name) angular.element($('#app')).scope().hoverOverCountryCompare(d.data.name);
            
            if(isDraging && !filteredObjects.includes(d3.select(this))) {
                filteredObjects.push(d3.select(this));
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

            //console.log("Start drag");
            isDraging = true;
        })
        .on('mouseup', function(d,i){
            //console.log("End drag");
            isDraging = false;

            if(filteredObjects.length > 1){
                selectedObject.style("stroke-width", 0);
                selectedCountry = "";
            }

            for (var i = 0; i < filteredObjects.length; i++) {
                filteredObjects[i].style("stroke-width", 0);
            }
            filteredObjects = [];
        })
        .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);


    // SLIDER //
    $("#slider").slider({
        value: 5,
        min: 0,
        max: 5,
        step: 1,
        slide: function(i, event){

        }
    })
    .each(function() {
      // Get the options for this slider
      var opt = $(this).data().uiSlider.options;
      
      // Get the number of possible values
      var vals = opt.max - opt.min;
      
      // Space out values
      for (var i = vals; i >= 0; i--) {
        var test = angular.element($('#app')).scope().getAllAnswers();
        var el = "";

        el = $('<label>'+test[0][i].interval+'</label>').css('left',(-10 + i/vals*100)+'%');
        
        $("#slider").append(el);
        
      }
    });
}





var calculateStartAngle = function(data){
    var originPop = 0;
    var totalPop = 0;

    originPop = data[0].pop;
    totalPop += originPop;

    for (var i = 0; i < data.length; i++) {
        totalPop += data[i].pop;
    }

    var quota = originPop / totalPop;
    startAngle = -(quota * Math.PI * 2) / 2;

    return startAngle;
}


function removePieChart(){
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
