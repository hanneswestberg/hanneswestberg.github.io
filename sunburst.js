var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, fullOrHalf() * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);
	
function fullOrHalf(){
	return (currentNode === 'All') ? 2 : 1;
}

var currentNode = 'All';

var color = d3.scale.category20c();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(fullOrHalf() * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(fullOrHalf() * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

d3.json("flare.json", function(error, root) {
  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("click", click);

  var text = g.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .text(function(d) { return d.name; });

  function click(d) {
    // fade out all text elements
    text.transition().attr("opacity", 0);
	  currentNode = d.name;

    svg.transition()
      .duration(300)
      .attrTween("transform", posTween(d))
	
    path.transition()
      .duration(300)
      .attrTween("d", arcTween(d))
      .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(300)
              .attr("opacity", 1)
              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
              .attr("x", function(d) { return y(d.y); })
			  .attr("visibility", function(d) { return (e.depth > d.depth) ? "hidden" : "visible"});
          }
      });	  
	
	console.log(d); 
	
	//if (d.name != 'All') 
		//svg.attr("align","left");
  
  }
});

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the position
function posTween(){
  // We only use 'd', but list d,i,a as params just to show can have them as params.
  // Code only really uses d and t.
  return function(d, i, a) {
    return function(t) {

  // 't': what's t? T is the fraction of time (between 0 and 1) since the
  // transition began. Handy. 
  var t_offset = d.get('offset');
  var t_x, t_y;

  // If the data says the element should follow a circular path, do that.
  if (d.get('rtype') == 'circle') {
    var rotation_radius = d.get('rotr');
    var t_angle = (2 * Math.PI) * t;
    var t_x = rotation_radius * Math.cos(t_angle);
    var t_y = rotation_radius * Math.sin(t_angle);
  }

  // Likewise for an ellipse:
  if (d.get('rtype') == 'ellipse')  {
    var rotation_radius_x = d.get('rotrx');
    var rotation_radius_y = d.get('rotry');
    var t_angle = (2 * Math.PI) * t;
    var t_x = rotation_radius_x * Math.cos(t_angle);
    var t_y = rotation_radius_y * Math.sin(t_angle);
  }

  return "translate(" + ((width/2) + t_offset + t_x) + "," + (height/2 + t_offset + t_y) + ")";
    };
  };
}


// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}