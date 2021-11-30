

const width =700;
const height =500;
const categories =['Guatemala', 'Honduras', 'El-Salvador']
const colors = {GTN:'#ffcc00',HND:'#baf1a1',SVD:'#cc0066'}
function createScales(){
    categoryColorScale = d3.scaleOrdinal(categories, colors)}
    const radiusScale = d3.scaleSqrt().domain([30,60]).range([10,20])
        
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

const legend = d3.select('#legend')
                    .append("svg")
                    .attr('width',300)
                    .attr('height',100)

const legend_circles = legend.selectAll("circle")                    
                    .data(categories)
                    .enter()
                        .append("circle")
                        .attr("r",20)
                        .attr("cx", (d,i)=> (i+1)*100-50)
                        .attr("cy",50)
                        .attr("fill",(d,i)=>{if(i ===0){return colors.GTN}
                        else if (i===1) {return colors.HND//  block of code to be executed if the condition1 is false and condition2 is true
                        } else { return colors.SVD//  block of code to be executed if the condition1 false and condition2 is false
                        }})
                        .style('visibility','visible')

const legend_text = legend.append("g")
                    .selectAll("text")                    
                    .data(categories)
                    .enter()
                        .append("text")
                        .attr("class", "legend-styling")
                        .attr("x",(d,i)=> (i+1)*100-90)
                        .attr("y",90)
                        .text((d,i)=>{if(i ===0){return categories[i]}
                        else if (i===1) {return categories[i]//  block of code to be executed if the condition1 is false and condition2 is true
                        } else { return categories[i]//  block of code to be executed if the condition1 false and condition2 is false
                        }})
                                   
let createSizeLegend=()=>{
    let svg = d3.select('#legend2')
            
    svg.append('g')
            .attr('class', 'sizeLegend')
            .attr('transform', `translate(100,50)`)

    sizeLegend2 = d3.legendSize()
        .scale(salarySizeScale)
        .shape('circle')
        .shapePadding(15)
        .title('Salary Scale')
        .labelFormat(d3.format("$,.2r"))
        .cells(7)

    d3.select('.sizeLegend')
        .call(sizeLegend2)
}
const rural_label = svg.append("g")
        .append('text')
        .attr('class','location_label')
        .attr('id','rural_label')
        .attr('x',50)
        .attr('y',100)
        .text("Rural")
        .style('visibility','hidden') 

const urban_label = svg.append("g")
        .append('text')
        .attr('class','location_label')
        .attr('id','urban_label')
        .attr('x',50)
        .attr('y',400)
        .text("Urban")
        .style('visibility','hidden') 

const country_label = svg.append("g")
        .selectAll("text")                    
        .data(categories)
        .enter()
            .append("text")
            .attr('class','country_label')
            .attr("x",(d,i)=>{if(i ===0){return 100
            }else if (i===1) {return 260
            } else {return 390 }})
            .attr("y",40)
            .text((d,i)=>{if(i ===0){return categories[i]}
            else if (i===1) {return categories[i]//  block of code to be executed if the condition1 is false and condition2 is true
            } else { return categories[i]//  block of code to be executed if the condition1 false and condition2 is false
            }})
        .style('visibility','hidden') 
    
//make radius scale
const forceXc = d3.forceX((d)=>{
                if(d.Country ==='GTN'){return 150
                }else if (d.Country ==='HND') {return 300
                } else {return 430 }})
                .strength(0.1)

const forceXstart = d3.forceX((d)=>width/2-100 ).strength(0.05)
const forceYstart = d3.forceY((d)=>height/2 ).strength(0.05)

const forceCollide = d3.forceCollide((d)=> radiusScale(d.Food))

    // set up force simulation
const simulation = d3.forceSimulation()
                        .force("x",forceXstart)
                        .force("y",forceYstart)
                        .force("collide",forceCollide)

    // scroll function 
function scroll(n, offset, func1, func2){
    return new Waypoint({
        element: document.getElementById(n),
        handler: function(direction) {
            direction == 'down' ? func1() : func2();},
        //start 75% from the top of the div
        offset: offset});};
      //const categoryColorScale = 
d3.csv("BasicNeeds.csv", d3.autoType).then((data)=>{
    dataset = data
    ready(data)});
// function for drawing the circles
let ready= (datapoints)=>{
    const circles = svg.selectAll(".Household")
                        .data(datapoints)
                        .enter()
                        .append("circle")
                            .attr("class","need")
                            .attr("id",(d)=>d.Household)
                            .attr("r",(d)=>radiusScale(d.Food))
                            .attr("fill",(d)=>colors[d.Country])
                            
    
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
        .html(`<strong>Country:</strong> ${i.Country}
            <br> <strong>Location:</strong> ${(i.Location).toUpperCase()}
            <br> <strong>Total:</strong> ${Math.round(i.Total* 100) / 100} 
            <br> <strong>Housing:</strong> ${Math.round(i.Housing* 100) / 100}
            <br> <strong>Food:</strong> ${(Math.round(i.Food* 100) / 100)}
            <br> <strong>Clothing:</strong> ${Math.round(i.Clothes* 100) / 100}`)}

    function mouseOut(d, i){
        tooldiv.style('visibility','hidden')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)}
    
    function ticked() {
        circles
        .attr("cx", (d)=> d.x)
        .attr("cy", (d)=> d.y)}
  
    const sepCountry = function (){
        simulation
        .force("x",forceXc)
        .alphaTarget(0.5)
        .restart()
    d3.selectAll('.country_label').style('visibility','visible')
        
    };
    // define function to separate locations
    const sepLocation = ()=>{
        simulation.force("y",d3.forceY((d)=>{
            if(d.Location ==='rural'){return 100
              } else {return 400}})
            .strength(0.05))
            .alphaTarget(0.5)
            .restart()
        d3.selectAll('.location_label').style('visibility','visible')
        };
      

        
    // define function to combine
    const combine =()=>{
        simulation.force("x",d3.forceX(width/2).strength(0.05))
                  .force("y",d3.forceY(height/2).strength(0.05))
                    .alphaTarget(0.05)
                    .restart()
        d3.selectAll('.location_label').style('visibility','hidden')
        d3.selectAll('.country_label').style('visibility','hidden')
        //d3.select('#urban_label').style('visibility','hidden')   
    };

    simulation.nodes(datapoints)
                .on('tick',ticked) 
     //triger these functions on page scroll
     new scroll('div2', '75%', sepCountry, combine);
     new scroll('div4', '75%', sepLocation, sepCountry);
     new scroll('div6', '75%', combine, sepLocation);

} 





