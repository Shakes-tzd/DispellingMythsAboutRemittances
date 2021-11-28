let box = document.querySelector('.holder');
let width = box.clientWidth*0.7;
let height = box.clientWidth*0.7;
const rad = 10;

const categories =['Guatemala', 'Honduras', 'El-Salvador']
const colors = {GT:'#ffcc00',HND:'#baf1a1',SLV:'#0096FF'}

function createScales(){
    categoryColorScale = d3.scaleOrdinal(categories, colors)}
    const radiusScale = d3.scaleSqrt().domain([0,100]).range([5,20])
    

const svg =d3.select("svg")
              .attr('width',width)
              .attr('height',height)
              .attr("viewBox", [0, 0, width, height])
                .append("g")
                .attr("transform","translate(0,0)")

const tooldiv = d3.select('.holder')
                    .append('div')
                    .attr("id","tooltip")

const rural_label = svg.append("g")
        .append('text')
        .attr('class','location_label')
        .attr('id','rural_label')
        .attr('x',5)
        .attr('y',height-height*0.7)
        .text("Rural")
        .style('visibility','hidden') 

const urban_label = svg.append("g")
        .append('text')
        .attr('class','location_label')
        .attr('id','urban_label')
        .attr('x',5)
        .attr('y',height-height*0.4)
        .text("Urban")
        .style('visibility','hidden') 

const country_label = svg.append("g")
        .selectAll("text")                    
        .data(categories)
        .enter()
            .append("text")
            .attr('class','country_label')
            .attr("x",(d,i)=>{
              if(i ===0){return width-0.8*width}
              else if (i===1) {return width-0.6*width} 
              else {return width-0.4*width }})
            .attr("y",20)
            .text((d,i)=>{
              if(i ===0){return categories[i]}
              else if (i===1) {return categories[i]} 
              else { return categories[i]}})
        .style('visibility','hidden') 
        
 let radius = (d)=> radiusScale(d.Food)


 // set up simulation forces 
const forceYsep = d3.forceY((d)=>{
                    if(d.rural_urban ===1){return height-height*0.6;} 
                    else {return height-height*0.5}}).strength(0.5)
const forceYsepFood = d3.forceY((d)=>{
                    if(d.Food >0){return height-height*0.6;} 
                    else {return height-height*0.55}}).strength(0.9)

const forceXsepUtilities = d3.forceX((d)=>{
                      if(d.Utilities >0){return width-0.6*width} 
                      else {return width-0.4*width}}).strength(0.9)

const forceXc = d3.forceX((d)=>{
                if(d.country ==='GT'){return width-0.6*width}
                else if (d.country ==='HND') {return width-0.5*width} 
                else {return width-0.4*width }}).strength(0.5)
                

const forceXstart = d3.forceX((d)=>width/2 ).strength(0.5)
const forceYstart = d3.forceY((d)=>height/3 ).strength(0.5)

const forceCollideFood = d3.forceCollide((d)=> radiusScale(d.Food)+5).strength(0.9)
const forceCollide = d3.forceCollide(rad+2).strength(0.5)//(d)=> radiusScale(d.Food)+2
center_force = d3.forceCenter(width / 2, height / 2.25);
    // set up force simulation
const simulation = d3.forceSimulation()
                        .force("x",forceXstart)
                        .force("y",forceYstart) // 
                        .force("center_force", center_force)
                        .force("collide",forceCollide)
                        .force("charge", d3.forceManyBody().strength(-80))
                        .alphaDecay(0.02)
                        .velocityDecay(0.8)
                        
                        

   
      //const categoryColorScale = 
d3.csv("MostBasicNeeds.csv", d3.autoType).then((data)=>{
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
                            .attr("r",rad) //(d)=>radiusScale(d.Food)
                            .attr("fill",'brown')//(d)=>colors[d.country]'
                            
    function ticked() {circles.attr("cx", function(d) {return d.x  })
                      .attr("cy", function(d) {return d.y  });}
    simulation.nodes(datapoints) //giving the simulation the data 
                .on('tick',ticked)
  // Set up action when scrolling 
    const sepCountry = function (){simulation
                    .force("x",forceXc.strength(0.5))
                    .force("y",forceYstart)
                    .alphaTarget(0.25)
                    .restart()
                    //.force("charge", d3.forceManyBody().strength(-20))
          d3.selectAll('.country_label').style('visibility','visible')
          circles.transition()
                  .attr("fill",(d)=>colors[d.country])
                  .duration(2000)
    };
    // define function to separate locations
    const sepLocation = ()=>{
                    simulation
                    .force("y",forceYsep)
                    .alphaTarget(0.25)
                    .restart()
                    //.force("charge", d3.forceManyBody().strength(-20))             
        d3.selectAll('.location_label').style('visibility','visible')
        };
        
    // define function to combine
    const combine =()=>{
                    simulation
                    .force("x",forceXstart)
                    .force("y",forceYstart)
                    .alphaTarget(0.25)
                    .restart()
                    //.force("charge", d3.forceManyBody().strength(-20))
                    
        d3.selectAll('.location_label').style('visibility','hidden')
        d3.selectAll('.country_label').style('visibility','hidden')
        //d3.select('#urban_label').style('visibility','hidden') 
        circles.transition()
                  .attr("fill",'brown')
                  .duration(2000)  
    };

const food_amount = ()=>{
  simulation.force("y",forceYsepFood)
            .force("charge", d3.forceManyBody().strength(-110)) //.force("collide",forceCollideFood) 
  circles.transition()
            .attr("fill",(d)=>d.Food>0?'#088F8F':'#088F8F50')
            .duration(500) //.attr("r",(d)=>radiusScale(d.Food))
}
const education = ()=>{
  simulation.force("y",forceYsepFood)
  circles.transition()
            .attr("fill",(d)=>d.Food>0?'#088F8F':'#FF5733')
             //(d)=>radiusScale(d.Food)
            .duration(500)
}
const utilities = ()=>{
  simulation.force("x",forceXsepUtilities)
                .force("charge", d3.forceManyBody().strength(-110))
  circles.transition()
            .attr("fill",(d)=>d.Utilities>0?'#E07A5F':'#E07A5F50')
            .duration(300)
}
const health = ()=>{
  
  circles.transition()
            .attr("fill",(d)=>d.Food>0?'#088F8F':'#FF5733')
            .duration(500)
}
// Set up tool tip effect on Mouse enter and exit
svg.selectAll('circle')
.on('mouseover', mouseOver)
.on('mouseout', mouseOut)

function mouseOver(event, d){
    d3.select(this)
    .transition('mouseover').duration(100)
    .attr('opacity', 1)
    .attr('stroke-width', 5)
    .attr('stroke', 'black')

    d3.select(event.target).style("cursor", "pointer");

    tooldiv.style('left', (event.pageX )+ 'px')
    .style('top', ( event.pageY) + 'px')
    .style('visibility','visible')
    .style('display', 'inline-block')
    .html(`<strong>Country:</strong> ${d.country}
        <br> <strong>Location:</strong> ${d.rural_urban ==1? 'Rural' :'Urban'}
        <br> <strong>Monthly Remittance Income:</strong> ${Math.round(d.monthly_remesa_amount* 100) / 100} 
        <br> <strong>Household Income:</strong> ${Math.round(d.avg_income_usd* 100) / 100}
        `)
        }

function mouseOut(event, d){
    tooldiv.style('visibility','hidden')

    d3.select(this)
        .transition('mouseout').duration(500)
        .attr('opacity', 0.8)
        .attr('stroke-width', 0)}
  


//  const Food= datapoints.map((d)=>d.Food)
//  const bin1 = d3.bin()
// const FoodHist = bin1(Food)
//draw_buckets(bin1, Food)



     // instantiate the scrollama
const scroller = scrollama();

const callbacks =[sepCountry,sepLocation]
// setup the instance, pass callback functions
scroller
  .setup({
    step: ".step",})
  .onStepEnter((response) => {
    if(response.index ===1){return food_amount();}
    else if (response.index ===2) {return utilities();} 
    else if (response.index ===4) {return sepLocation();} 
    else if (response.index==5){return sepCountry()}
    else {return combine(); }})
    
  .onStepExit((response) => {
    // { element, index, direction }
  });

// setup resize event
window.addEventListener("resize", scroller.resize);
} 

// calling all of the Html classes
const img2 = document.querySelector('.img2')

// horizontal movement
window.addEventListener('keydown',(e)=>{
	if(e.key == 'h'){
		window.addEventListener('mousemove',(e)=>{
			img2.style.left = e.clientX +'px'
			img2.style.top = 0 +'px'
		})
	}
})

window.addEventListener('mousemove',(e)=>{
	img2.style.left = e.clientX + 'px'
	img2.scroll.top = 0 + 'px'
})


