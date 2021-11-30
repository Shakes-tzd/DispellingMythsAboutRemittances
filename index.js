let box = document.querySelector('.chart_container');
let width = box.clientWidth;
let height = box.clientHeight;

const rad = 8;// radius of bubbles
const first_color = '#E7B36B' //first color of bubbles

const NeedColors={
  'Food':['#088F8F','#088F8F50'],
  'Utilities':['#cc33ff','#cc33ff50'],
  'Health':['#ff6600','#ff660050'],
  'Education':['#0000ff','#0000ff50'],
  'Clothing':['#cc33ff','#cc33ff50']

}
const categories =['Guatemala', 'Honduras', 'El-Salvador']
const colors = {GT:'#E4D0CF',HND:'#BFCECB',SLV:'#D3E5EF'}

const svg =d3.select("svg")
              .classed("svg-container", true)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", [0, 0, width, height])
              .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform","translate(0,10)")
                .attr('id',"bubbles")


function createScales(){
    categoryColorScale = d3.scaleOrdinal(categories, colors)}
    const radiusScale = d3.scaleSqrt().domain([0,100]).range([5,20])
    


                

const tooldiv = d3.select('.container-1')
                    .append('div')
                    .attr("id","tooltip")

 // set up simulation forces 

 const chartDiv = document.getElementById("chart");                      

d3.csv("MostBasicNeeds.csv", d3.autoType).then((data)=>{
    dataset = data
    ready(data)
    window.addEventListener("resize", ready)
  });
// function for drawing the circles
let ready= (datapoints)=>{
  let width = chartDiv.clientWidth;
  let height = chartDiv.clientHeight/2.3;

  svg.attr("width", width)
      .attr("height", height);

const forceXc = d3.forceX((d)=>{
    if(d.country ==='GT'){return width-0.6*width}
    else if (d.country ==='HND') {return width-0.5*width} 
    else {return width-0.4*width }}).strength(0.85)
    

const forceXstart = d3.forceX((d)=>width/2 ).strength(0.5)
const forceYstart = d3.forceY((d)=>height/2 ).strength(0.5)
const forceYreset = d3.forceY((d)=>height/2 )
const forceXreset = d3.forceX((d)=>width/2 )

const forceCollide = d3.forceCollide(rad+5).strength(0.5)//(d)=> radiusScale(d.Food)+2
const center_force = d3.forceCenter(width / 2, height / 2);

// set up force simulation    
const simulation = d3.forceSimulation()
            .force("x",forceXstart)
            .force("y",forceYstart) // 
            .force("center_force", center_force)
            .force("collide",forceCollide)
            .force("charge", d3.forceManyBody().strength(-60))
            .alphaDecay(0.03)
            .velocityDecay(0.75)


    const circles = svg.selectAll(".Household")
                        .data(datapoints)
                        .enter()
                        .append("circle")
                            .attr("class","need")
                            .attr("id",(d)=>d.Household)
                            .attr("r",rad) //(d)=>radiusScale(d.Food)
                            .attr("fill",first_color)//(d)=>colors[d.country]'
                            
    function ticked() {circles.attr("cx", function(d) {return d.x  })
                      .attr("cy", function(d) {return d.y  });}
    simulation.nodes(datapoints) //giving the simulation the data 
                .on('tick',ticked)
  // Set up action when scrolling 
    const sepCountry = function (){simulation
                    .force("x",forceXc.strength(0.5))
                    .force("y",forceYstart)
                    .force("charge", d3.forceManyBody().strength(-60))
                    .alphaTarget(0.2)
                    .restart()
          //add labels for countries         
          const country_label = svg.append('g')
          .selectAll("text")                    
          .data(categories)
          .enter()
              .append("text")
              .attr('class','label')
              .attr('id','country_label')
              .attr("x",(d,i)=>{
                if(i ===0){return width-0.9*width}
                else if (i===1) {return width-0.62*width} 
                else {return width-0.4*width }})
              .attr("y",height*0.40)
              .text((d,i)=>{
                if(i ===0){return categories[i]}
                else if (i===1) {return categories[i]} 
                else { return categories[i]}})
              .style('visibility','hidden') 
          //reveal labels for countries 

          d3.selectAll('#country_label').style('visibility','visible')
          //changes the colors for the countries 
          circles.transition()
                  .attr("fill",(d)=>colors[d.country])
                  .duration(1000)
    };
    const CountriesExit = ()=>{
      d3.selectAll('#country_label').style('visibility','hidden')
          circles.transition()
                  .attr("fill",first_color)
                  .duration(1000)
                  combine()}
    // define force to separate locations
    const sepLocation = ()=>{
      const forceYsepLocation = d3.forceY((d)=>{
        if(d.rural_urban ===1){return height-height*0.6;} 
        else {return height-height*0.5}}).strength(0.8)

    //change the simulation to move bubbles to the desired location
        simulation
        .force("y",forceYsepLocation)
        .force("charge", d3.forceManyBody().strength(-60))
        .alphaTarget(0.2)
        .restart()
      //add location labels 
        const rural_label = svg.append("g")
        .append('text')
        .attr('class','label')
        .attr('id','location_label')
        .attr('x',width/2-20)
        .attr('y',height-height*0.7)
        .text("Rural")
        .style('visibility','hidden') 

        const urban_label = svg.append("g")
        .append('text')
        .attr('class','label')
        .attr('id','location_label')
        .attr('x',width/2-20)
        .attr('y',height-height*0.3)
        .text("Urban")
        .style('visibility','hidden')            
                    //.force("charge", d3.forceManyBody().strength(-20))             
        d3.selectAll('#location_label').style('visibility','visible')
        };
    const LocationExit = ()=>{
      d3.selectAll('#location_label').style('visibility','hidden')
            combine()
        }
        
    // define function to combine
    const combine =()=>{
            simulation
                    .force("x",forceXstart)
                    .force("y",forceYstart)
                    .force("r", null)
                    
                    //.force("charge", d3.forceManyBody().strength(-20))
                    
        d3.selectAll('#location_label').style('visibility','hidden')
        d3.selectAll('#country_label').style('visibility','hidden')
        //d3.select('#urban_label').style('visibility','hidden') 
        circles.transition().attr("fill",first_color)  
    };

const food_amount = ()=>{
  const forceYsepFood = d3.forceY((d)=>{
    if(d.Food >0){return height-height*0.6;} 
    else {return height-height*0.5}}).strength(0.9)

  simulation.force("y",forceYsepFood)
            .force("x",forceXreset.strength(0.6))
            .force("charge", d3.forceManyBody().strength(-90))
            .alphaTarget(0.2)
                .restart()
  
  const Food_label = svg.append("g")
                .append('text')
                  .attr('class','label')
                  .attr('id','food_label')
                  .attr('x',width/2-100)
                  .attr('y',height-height*0.82)
                  .text("Food Purchase")
                  .style('visibility','hidden')
    
    const noFood_label = svg.append("g")
                .append('text')
                .attr('class','label')
                .attr('id','food_label')
                .attr('x',width/2-100)
                .attr('y',height-height*0.15)
                .text("No Food Purchase")
                .style('visibility','hidden')
  
  d3.selectAll('#food_label').style('visibility','visible')         
  circles.transition()
            .attr("fill",(d)=>d.Food>0?NeedColors.Food[0]:NeedColors.Food[1])
            .duration(500) }

const foodExit = ()=>{
  d3.selectAll('#food_label').style('visibility','hidden')
        combine()}


const utilities = ()=>{
  const forceXsepUtilities = d3.forceX((d)=>{
    if(d.Utilities >0){return width-0.6*width} 
    else {return width-0.4*width}}).strength(0.9)

  simulation.force("x",forceXsepUtilities)
                .force("y",forceYreset.strength(0.7))
                .alphaTarget(0.2)
                .restart()
  
  const Utilities_label = svg.append("g")
                .append('text')
                  .attr('class','label')
                  .attr('id','utilities_label')
                  .attr('x',width-0.85*width)
                  .attr('y',height-height*0.87)
                  .text("Utilities Purchase")
                  .style('visibility','hidden')
    
  const noUtilities_label = svg.append("g")
                .append('text')
                .attr('class','label')
                .attr('id','utilities_label')
                .attr('x',width/2-20)
                .attr('y',height-height*0.87)
                .text("No Utilities Purchase")
                .style('visibility','hidden')
                //.force("charge", d3.forceManyBody().strength(-80))
  circles.transition()
            .attr("fill",(d)=>d.Utilities>0?NeedColors.Utilities[0]:NeedColors.Utilities[1])
            .duration(500)
d3.selectAll('#utilities_label').style('visibility','visible')
}
const utilitiesExit = ()=>{
  d3.selectAll('#utilities_label').style('visibility','hidden')
        combine()}

const health = ()=>{
  const forceYsepHealth = d3.forceY((d)=>{
    if(d.Health >0){return height-height*0.6;} 
    else {return height-height*0.55}}).strength(0.9)

    simulation.force("y",forceYsepHealth)
              .force("x",forceXreset.strength(0.6))
                .alphaTarget(0.2)
                .restart()
      
//Health Labels 
  const Health_label = svg.append("g")
            .append('text')
              .attr('class','label')
              .attr('id','Health_label')
              .attr('x',width-0.65*width)
              .attr('y',height-height*0.83)
              .text("Health Payment")
              .style('visibility','hidden')

  const noHealth_label = svg.append("g")
            .append('text')
            .attr('class','label')
            .attr('id','Health_label')
            .attr('x',width-0.65*width)
            .attr('y',height-height*0.27)
            .text("No Health Payment")
            .style('visibility','hidden')

    d3.selectAll('#Health_label').style('visibility','visible')
  
    circles.transition()
            .attr("fill",(d)=>d.Health>0?NeedColors.Health[0]:NeedColors.Health[1])
            .duration(500)
}
const healthExit = ()=>{
  d3.selectAll('#Health_label').style('visibility','hidden')
        combine()}

const education = ()=>{
  const forceXsepEducation = d3.forceX((d)=>{
    if(d.Education >0){return width-0.6*width} 
    else {return width-0.4*width}}).strength(0.9)

  simulation.force("x",forceXsepEducation)
              .force("y",forceYreset.strength(0.7))
              .alphaTarget(0.2)
              .restart()
              
    //add education labels
  const Education_label = svg.append("g")
              .append('text')
                .attr('class','label')
                .attr('id','Education_label')
                .attr('x',width-0.9*width)
                .attr('y',height-height*0.75)
                .text("Education Payment")
                .style('visibility','hidden')
  
  const noEducation_label = svg.append("g")
              .append('text')
              .attr('class','label')
              .attr('id','Education_label')
              .attr('x',width-0.6*width)
              .attr('y',height-height*0.75)
              .text("No Education Payment")
              .style('visibility','hidden')

  d3.selectAll('#Education_label').style('visibility','visible')
  circles.transition()
            .attr("fill",(d)=>d.Education>0?NeedColors.Education[0]:NeedColors.Education[1])
             //(d)=>radiusScale(d.Food)
            .duration(500)
}
const educationExit = ()=>{
  d3.selectAll('#Education_label').style('visibility','hidden')
        combine()}

const clothing = ()=>{
          const forceRClothing = d3.forceRadial(function(d) { return d.ClothesandShoes >0 ? 10 : 400; })
        
          simulation.force("r",forceRClothing)
                      .alphaTarget(0.2)
                      .restart()
        
            //add education labels
          const Clothing_label = svg.append("g")
                      .append('text')
                        .attr('class','label')
                        .attr('id','Clothing_label')
                        .attr('x',width-0.9*width)
                        .attr('y',height-height*0.75)
                        .text("Clothing Payment")
                        .style('visibility','hidden')
          
          const noClothing_label = svg.append("g")
                      .append('text')
                      .attr('class','label')
                      .attr('id','Clothing_label')
                      .attr('x',width-0.6*width)
                      .attr('y',height-height*0.75)
                      .text("No Clothing Payment")
                      .style('visibility','hidden')
        
          d3.selectAll('#Clothing_label').style('visibility','visible')
          circles.transition()
                    .attr("fill",(d)=>d.ClothesandShoes>0?NeedColors.Clothing[0]:NeedColors.Clothing[1])
                     //(d)=>radiusScale(d.Food)
                    .duration(500)
        }
const clothingExit = ()=>{
          d3.selectAll('#Clothing_label').style('visibility','hidden')
                combine()}

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

    const RemitToIncomeRatio =(d.monthly_remesa_amount)/(d.avg_income_usd) 
    
    let RemitPCT = (RemitToIncomeRatio<=1)?Math.round(RemitToIncomeRatio*100):Math.round((RemitToIncomeRatio-1)*100)

    

    d3.select(event.target).style("cursor", "pointer");

    tooldiv.style('left', (event.pageX )+ 'px')
    .style('top', ( event.pageY) + 'px')
    .style('visibility','visible')
    .style('display', 'inline-block')
    .html(`<b>Country:</b> ${d.country}
        <br> <b>Location:</b> ${d.rural_urban ==1? 'Rural' :'Urban'}
        <br> <b>Monthly Remittance Income:</b> USD$ ${Math.round(d.monthly_remesa_amount* 100) / 100} 
        <br> <b>Household Income:</b> USD$ ${Math.round(d.avg_income_usd* 100) / 100}
        <br> <b>Household Remittances to Household Income Ratio:</b> ${RemitToIncomeRatio<=1? 'Remittances make up '+RemitPCT+'% of the Household Income' :'Remittances are '+RemitPCT+'% more than the Household Income'}
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

const EnterCallbacks =[combine,sepCountry,
  sepLocation,
  food_amount,
  utilities,
  health,
  education,
  clothing
]
const ExitCallbacks =[combine,
  CountriesExit,
  LocationExit,
  foodExit,
  utilitiesExit,
  healthExit,
  educationExit,
  clothingExit
]
// setup the instance, pass callback functions
const steps = d3.selectAll(".step")
scroller
  .setup({
    step: ".step",})
  .onStepEnter((response) => {
    //console.log( 'enter: ')
    //console.log(response)
    steps.style("opacity",0.1)
    d3.select(response.element).style("opacity",1)
    if (response.index<=EnterCallbacks.length-1 ){EnterCallbacks[response.index]()}
    
    // if(response.index ===1){return sepCountry();}
    // else if (response.index ===2) {return sepLocation() ;} 
    // else if (response.index ===4) {return food_amount();} 
    // else if (response.index==5){return utilities()}
    // else if (response.index==6){return utilities()}
    })
    
  .onStepExit((response) => {
    if (response.index<=ExitCallbacks.length-1 ){ExitCallbacks[response.index]()}
    //console.log('exit: ')
    //console.log(response)
    // if(response.index ===1){return CountriesExit();}
    // else if(response.index ===2){return LocationExit();}
    // else if(response.index ===4) {return foodExit();}
    // else if(response.index ===5) {return utilitiesExit();}
    // { element, index, direction }
  });

// setup resize event
window.addEventListener("resize", scroller.resize);
} 

// calling all of the Html classes

