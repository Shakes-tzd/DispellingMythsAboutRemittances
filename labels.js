let box = document.querySelector('.chart_container');
let width = box.clientWidth;
let height = box.clientHeight;
const rad = 8;
const first_color = '#E7B36B'
const categories =['Guatemala', 'Honduras', 'El-Salvador']
const colors = {GT:'#E4D0CF',HND:'#BFCECB',SLV:'#D3E5EF'}

const svg =d3.select("svg")
              .attr('width',width)
              .attr('height',height)
              .attr("viewBox", [0, 0, width, height])
                .append("g")
                .attr('id',"bubbles")


const rural_label = d3.select('#chart').append("g")
        .append('text')
        .attr('class','label')
        .attr('id','location_label')
        .attr('x',width/2-20)
        .attr('y',height-height*0.7)
        .text("Rural")
        .style('visibility','hidden') 

const urban_label = d3.select('#chart').append("g")
        .append('text')
        .attr('class','label')
        .attr('id','location_label')
        .attr('x',width/2-20)
        .attr('y',height-height*0.3)
        .text("Urban")
        .style('visibility','hidden') 

const country_label = d3.select('#chart').append('g')
        .selectAll("text")                    
        .data(categories)
        .enter()
            .append("text")
            .attr('class','label')
            .attr('id','country_label')
            .attr("x",(d,i)=>{
              if(i ===0){return width-0.9*width}
              else if (i===1) {return width-0.65*width} 
              else {return width-0.4*width }})
            .attr("y",height*0.40)
            .text((d,i)=>{
              if(i ===0){return categories[i]}
              else if (i===1) {return categories[i]} 
              else { return categories[i]}})
            .style('visibility','hidden') 
        
const Food_label = d3.select('#chart').append("g")
            .append('text')
              .attr('class','label')
              .attr('id','food_label')
              .attr('x',width/2-100)
              .attr('y',height-height*0.82)
              .text("Food Purchase")
              .style('visibility','hidden')

const noFood_label = d3.select('#chart').append("g")
            .append('text')
            .attr('class','label')
            .attr('id','food_label')
            .attr('x',width/2-100)
            .attr('y',height-height*0.25)
            .text("No Food Purchase")
            .style('visibility','hidden')

const Utilities_label = d3.select('#chart').append("g")
            .append('text')
              .attr('class','label')
              .attr('id','utilities_label')
              .attr('x',width-0.85*width)
              .attr('y',height-height*0.87)
              .text("Utilities Purchase")
              .style('visibility','hidden')

const noUtilities_label = d3.select('#chart').append("g")
            .append('text')
            .attr('class','label')
            .attr('id','utilities_label')
            .attr('x',width/2-20)
            .attr('y',height-height*0.87)
            .text("No Utilities Purchase")
            .style('visibility','hidden')

const Education_label = d3.select('#chart').append("g")
            .append('text')
              .attr('class','label')
              .attr('id','Education_label')
              .attr('x',width-0.65*width)
              .attr('y',height-height*0.91)
              .text("Education Payment")
              .style('visibility','hidden')

const noEducation_label = d3.select('#chart').append("g")
            .append('text')
            .attr('class','label')
            .attr('id','Education_label')
            .attr('x',width-0.7*width)
            .attr('y',height-height*0.55)
            .text("No Education Payment")
            .style('visibility','hidden')
//Health Labels 
const Health_label = d3.select('#chart').append("g")
            .append('text')
              .attr('class','label')
              .attr('id','Health_label')
              .attr('x',width-0.65*width)
              .attr('y',height-height*0.83)
              .text("Health Payment")
              .style('visibility','hidden')

const noHealth_label = d3.select('#chart').append("g")
            .append('text')
            .attr('class','label')
            .attr('id','Health_label')
            .attr('x',width-0.65*width)
            .attr('y',height-height*0.27)
            .text("No Health Payment")
            .style('visibility','hidden')