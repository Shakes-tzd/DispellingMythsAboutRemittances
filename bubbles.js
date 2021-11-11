(function(){

    const width =700;
    const height =500;
    const categories =['Guatemala', 'Honduras', 'El-Salvador']
        
    //create SVG element 
    const svg =d3.select("#chart")
    .append("svg")
    .attr("height",height)
    .attr("width",width)
    .append("g")
    .attr("transform","translate(0,0)")
    
    const tooldiv = d3.select('#chart')
                        .append('div')
                        .attr("id","tooltip")

    const colors = ['#ffcc00','#baf1a1','#cc0066']

    function createScales(){
        categoryColorScale = d3.scaleOrdinal(categories, colors)}
    
    //make radius scale
    const radiusScale = d3.scaleSqrt().domain([41,135]).range([10,50])

    const forceXc = d3.forceX(function(d){
        if(d.Country ==='GTN'){
            return 100
        }else if (d.Country ==='HND') {
            return 250
            //  block of code to be executed if the condition1 is false and condition2 is true
          } else {
            return 430
            //  block of code to be executed if the condition1 false and condition2 is false
        }
    }).strength(0.2)

    const forceXstart = d3.forceX(function(d){
        return width/2
    }).strength(0.05)

    const forceCollide = d3.forceCollide(function(d){
        return radiusScale(d.Total)
    })

    // set up force simulation
    const simulation = d3.forceSimulation()
    .force("x",forceXstart)
    .force("y",d3.forceY(height/2).strength(0.05))
    .force("collide",forceCollide)

    function scroll(n, offset, func1, func2){
        return new Waypoint({
          element: document.getElementById(n),
          handler: function(direction) {
             direction == 'down' ? func1() : func2();
          },
          //start 75% from the top of the div
          offset: offset
        });
      };
      //const categoryColorScale = 
      

    function ready (datapoints){
        const circles = svg.selectAll(".Household")
        .data(datapoints)
        .enter().append("circle")
        .attr("class","need")
        .attr("id",function(d){
            return d.Household
        })
        .attr("r",function(d){
            return radiusScale(d.Food)
        })
        .attr("fill",function(d){
            if(d.Country ==='GTN'){
                return '#ffcc00'
            }else if (d.Country ==='HND') {
                return '#baf1a1'
                //  block of code to be executed if the condition1 is false and condition2 is true
              } else {
                return '#cc0066'
                //  block of code to be executed if the condition1 false and condition2 is false
            }
        })
        
        svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

        function mouseOver(d, i){
            
            d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')

            tooldiv.style('left', (d.clientX )+ 'px')
            .style('top', ( d.clientY ) + 'px')
            .style('visibility','visible')
            .style('display', 'inline-block')
            .html(`<strong>Total:</strong> ${i.Total} 
                <br> <strong>Housing:</strong> ${i.Housing}
                <br> <strong>Location:</strong> ${i.Location}
                <br> <strong>Food:</strong> ${(i.Food)}
                <br> <strong>Clothing:</strong> ${(i.Food)}`)

        }

        function mouseOut(d, i){
            tooldiv.style('visibility','hidden')
    
            d3.select(this)
                .transition('mouseout').duration(100)
                .attr('opacity', 0.8)
                .attr('stroke-width', 0)
        }
        
        function ticked() {
            circles
            .attr("cx", function(d){
            return d.x})
            .attr("cy", function(d){
            return d.y})
        
    }
    // function createLegend(x, y){
    //     let svg = d3.select('#legend')
    
    //     svg.append('g')
    //         .attr('class', 'categoryLegend')
    //         .attr('transform', `translate(${x},${y})`)
    
    //     categoryLegend = d3.legendColor()
    //                             .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
    //                             .shapePadding(10)
    //                             .scale(categoryColorScale)
    //     d3.select('.categoryLegend')
    //         .call(categoryLegend)
    // }
    //  createLegend(20, 50)
    // define function to separate countries
    const sepCountry = function (){
        simulation
        .force("x",forceXc)
        .alphaTarget(0.5)
        .restart()
    };
// define function to separate locations
    const sepLocation = function (){
        simulation
        .force("y",d3.forceY(function(d){
            if(d.Location ==='rural'){
                return 100
              } else {
                return 400
                //  block of code to be executed if the condition1 false and condition2 is false
            }}).strength(0.05))
        .alphaTarget(0.5)
        .restart()
    };
// define function to combine
const combine =function(){
    simulation
    .force("x",d3.forceX(width/2).strength(0.05))
    .force("y",d3.forceY(width/2).strength(0.05))
    .alphaTarget(0.05)
    .restart()
};

    d3.select("#country").on('click',sepCountry)
    d3.select("#local").on('click',sepLocation)

    d3.select("#combine").on('click',combine)
        simulation.nodes(datapoints)
        .on('tick',ticked) 
     //triger these functions on page scroll
     new scroll('div2', '75%', sepCountry, combine);
     new scroll('div4', '75%', sepLocation, sepCountry);
     new scroll('div6', '75%', combine, sepLocation);
} 



d3.csv("BasicNeeds.csv", d3.autoType).then(function(data) {
    console.log(data);

    ready(data);
});



}

());