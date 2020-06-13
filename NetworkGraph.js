
var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("z-index", "10")
    .style("width","200px")                  
    .style("height","150px")                 
    .style("padding","2px")             
    .style("font","12px sans-serif")
    .style("border","0px")      
    .style("border-radius","8px")  
    .style("background", "steelblue")
    .style("fill-opacity", ".7")
.style("visibility", "hidden");

var svg = d3.select("svg"),
    width = 900,
    height = 600,
    x_browser = 20,
    y_browser = 25;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var dataset;

d3.csv("NetworkData.csv", function(data){
    console.log(data)
   dataset=data;
   nodes = MakeNodes();
   links = MakeLinks();

   MakeLayout(nodes, links);
   });


function MakeNodes() {


nodes1 = dataset.map(function(entry, idx, list) {
        // This iteration returns a new object for
        // each node.
        var node = {};
        // We retain some of the album's properties.
        node.id = entry.Seller;
        node.image = entry.SellerImage;
        node.x = width/2;
        node.y = height/2;
        node.Type = "Seller"
        // Return the newly created object so it can be
        // added to the nodes array.
        return node;
});
nodes2 = dataset.map(function(entry, idx, list) {
        // This iteration returns a new object for
        // each node.
        var node = {};
        // We retain some of the album's properties.
        node.id = entry.Buyer;
        node.image = entry.BuyerImage;
        node.x = width/2;
        node.y = height/2;
        node.Type = "Buyer"
        // Return the newly created object so it can be
        // added to the nodes array.
        return node;
});

var nodes = nodes1.concat(nodes2);

var seenNames = {};

nodes = nodes.filter(function(currentObject) {
    if (currentObject.id in seenNames) {
        return false;
    } else {
        seenNames[currentObject.id] = true;
        return true;
    }
});

console.log(nodes);
return nodes

}

function MakeLinks(){
    var links = dataset.map(function(entry, idx, list) {
        // This iteration returns a new object for
        // each node.
        var link = {};
        // We retain some of the album's properties.
        link.source    = entry.Seller;
        link.target      = entry.Buyer;
        link.Artist    = entry.Artist;
        link.Painting = entry.Painting;
        link.Image = entry.PaintingImage;
        link.House = entry['Auction house']
        
        
        return link;
});
console.log(links);
return links
}

function MakeLayout(nodes, links) {

var force = d3.layout.force(); 




var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(.3))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height/ 2));


var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return 10; });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes, function(d) { return d.id; })
    .enter().append("svg:g")
    
  var circles = node.append("circle")
      .attr("r", 7)
      .attr("fill", function(d) { return color(d.House); });

    // Append images
    var images = node.append("svg:image")
            .attr("xlink:href",  function(d) { return d.image;})
            .attr("x", function(d) { return -25;})
            .attr("y", function(d) { return -25;})
            .attr("height", 50)
            .attr("width", 50)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


    node.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser +15)
      .attr("fill", "black")
      .attr("opacity", "0")
      .attr("id",function(d) {return d.id})
      .text(function(d) { return d.id; });

    var div = d3.select("div.tooltip");

  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("stroke", function(d) { return color(d.House);}) 	
        .on("mouseover", function(d, i){
            tooltip.html('');
            tooltip.html("Painting: "+d.Painting
                    +"<br/>"+"Artist: "+d.Artist
                    +"<br/>"+"Auction House: "+d.House);
            tooltip.append("img")
                    .attr("src",d.Image)
                    .attr("x", -8)
                    .attr("y", -8) 
                    .attr("width","100px")                 
                    .attr("height","auto"); 
            tooltip.style("visibility", "visible");
            })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-                   
                                    10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(d, i){
            tooltip.style("visibility", "hidden")
            div.transition()
                .duration(500)
                .style("opacity", 0)});

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .on("mouseover", function(d, i){
            document.getElementById(d.id).style.opacity = '1';
            })
        .on("mouseout", function(d, i){
            document.getElementById(d.id).style.opacity = '0';
});
  }
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
var setEvents = images
        .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);
          })

          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });

}

