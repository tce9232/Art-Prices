d3.csv("Art.csv", function (error, data) {
        
            if (error) throw error;
        
            console.log(data)
            grid = document.getElementById("grid"); 
            
            // format data
            data.forEach(function(d) {
                g = document.createElement('div');
                g.setAttribute("class", "grid-item") 
                g.setAttribute("width", d.Width/4)
                g.setAttribute('height', d.Height/4);   

                        
                
                var img = document.createElement("img");
                img.setAttribute('class', "grid-item");
                img.setAttribute('width', d.Width/4);
                img.setAttribute('height', d.Height/4);
                img.setAttribute("id", d.Painting);

                img.src = d.Image;
                g.appendChild(img);
                grid.appendChild(g);
            })  
        
        })

     
    var $grid = $('.grid').masonry({
   // options
   itemSelector: '.grid-item',
   columnWidth: 200,
   buffer: 10
 });
       
$grid.on( 'click', '.grid-item', function() {
  // change size of item via class
  $( this ).toggleClass('grid-item--gigante');
  // trigger layout
  $grid.masonry();
});

$grid.on( 'hover', '.grid-item', function() {
  // change size of item via class
  // $( this ).toggleClass('grid-item--bigger');
  // trigger layout
  $grid.masonry();
});

$grid.on( 'layoutComplete', function( event, laidOutItems ) {
  console.log( 'Masonry layout complete with ' + laidOutItems.length + ' items' );
});
