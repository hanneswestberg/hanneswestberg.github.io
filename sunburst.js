var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var currentNode = 'All';

var previousNode = 'All';

var currentlySelected = 'All';
  
function fullOrHalf(){
  return (currentNode === 'All') ? 2 : 1;
}

var xFull = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var xHalf = d3.scale.linear()
    .range([0, Math.PI]);

function x(x){
  return (fullOrHalf() == 2) ? xFull(x) : xHalf(x);
}

var y = d3.scale.linear()
    .range([0, radius]);

var color = d3.scale.category20c();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arcFull = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var arcHalf = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

function correctArc(d){
  return (fullOrHalf() == 2) ? arcFull(d) : arcHalf(d);
}

d3.json("flare.json", function(error, root) {
  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arcFull)
    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("click", click)
    .on ("mouseover", hoover)
    .on ("mouseout", function(){
      path.style({opacity:'1.0'})

      if(currentNode.includes("Group")){
        currentlySelected = d3.select(this).data();
        CreateChart(currentlySelected[0].name);
        console.log(currentlySelected[0].name);
      }

    });

  var text = g.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "20") // margin
    .attr("dy", ".35em") // vertical-align
    .text(function(d) { return d.name; });

  function hoover(){
    d3.select(this).style({opacity:'0.8'})


    if(currentNode != 'All' && d3.select(this).name != 'All' && !d3.select(this).includes("Group")){
        currentlySelected = d3.select(this).data();
        CreateChart(currentlySelected[0].name);
        console.log(currentlySelected[0].name);
    }
  }


  function click(d) {
    // fade out all text elements
    text.transition().attr("opacity", 0);
    previousNode = currentNode;
	  currentNode = d.name;

    if(currentNode != 'All'){
      CreateChart(currentNode);
    }
    else
      HideChart();

    svg.transition()
      .duration(750)
      .attrTween("transform", posTween(d))
	
    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
      .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(750)
              .attr("opacity", 1)
              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
              .attr("x", function(d) { return y(d.y); })
          }
      });  
  }
});

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the position
function posTween(){
  return function(d, i, a) {
    return function(t) {

  if(currentNode === 'All' && previousNode != 'All')
    return "translate(" + (80 -(t*80) + (width/2)*(t)) + "," + (height / 2) + ")";
  else if (previousNode === 'All' && currentNode != 'All')
    return "translate(" + (480 -(t*480) + (80)*(t))  + "," + (height / 2) + ")";
  else if (currentNode === 'All' && previousNode === 'All')
    return "translate(" + (width/2)  + "," + (height / 2) + ")";
  else 
    return "translate(" + 80  + "," + (height / 2) + ")";
    };
  };
}


// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(xHalf.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return correctArc(d); }
        : function(t) { (fullOrHalf() == 2) ? xFull.domain(xd(t)) : xHalf.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return correctArc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}