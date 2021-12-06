let box2 = document.querySelector('.hist');
let width2 = box2.clientWidth;
let height2 = box2.clientHeight;
// console.log(box2.clientWidth)
// console.log(box2.clientHeight)

const expenseCenters = {
    "Other": {x: width2/10 , y: height2/3,'color':'#DAA520' },
    "Housing": {x: 2.1*width2/10 , y: height2/3,'color':'#0B5A5F' },
    "Education": {x: 3.2*width2/10 , y: height2/3,'color':'#54A4AA' },
    "Clothing": {x: 4.25 * width2/10, y: height2/3,'color': '#AB878A'},
    "Utilities": {x: 6.75 * width2/10, y: height2/3,'color': '#8098B2'},
    "Health": {x: 5.5* width2/10, y: height2/3 ,'color':'#86738C'},
    "Food": {x: 8 * width2/10, y: height2/3,'color':'#AD98B4' }  
};
const expenses = [
    {ex_name:"Other",x: expenseCenters.Other.x , y: expenseCenters.Other.y,'color':expenseCenters.Other.color },
    {ex_name:"Housing",x: expenseCenters.Housing.x , y: expenseCenters.Housing.y,'color':expenseCenters.Housing.color },
    {ex_name:"Education",x: expenseCenters.Education.x , y: expenseCenters.Education.y,'color':expenseCenters.Education.color },
    {ex_name:"Clothing",x: expenseCenters.Clothing.x , y: expenseCenters.Clothing.y,'color':expenseCenters.Clothing.color},
    {ex_name:"Utilities",x: expenseCenters.Utilities.x , y: expenseCenters.Utilities.y,'color':expenseCenters.Utilities.color},
    {ex_name:"Health",x: expenseCenters.Health.x , y: expenseCenters.Health.y,'color':expenseCenters.Health.color},
    {ex_name:"Food",x: expenseCenters.Food.x , y: expenseCenters.Food.y,'color':expenseCenters.Food.color }  
];
const r=3;

d3.csv("data/MostBasicNeeds.csv", d3.autoType).then((alldata)=>{
    foodData = []
    healthData = []
    utilData = []
    clothData = []
    edData = []
    houseData = []
    otherData = []
    
    const findexpenses = alldata.map(d=>{
        let basic = {'avg_income_usd':d.avg_income_usd,
        'country': d.country,
        'remesa_amount_usd': d.remesa_amount_usd, 
        'rural_urban':d.rural_urban}
        if(d.Food>0){
            const Foodcopy = Object.assign({}, basic);
            Foodcopy.food =d.Food
                foodData.push(Foodcopy)}
        if(d.Health>0){
            const Healthcopy = Object.assign({}, basic);
            Healthcopy.health =d.Health
            healthData.push(Healthcopy)
        }
        if(d.Utilities>0){
            const Utilcopy = Object.assign({}, basic);
            Utilcopy.utilities =d.Utilities
            utilData.push(Utilcopy)
        }
        if(d.ClothesandShoes>0){
            const Clothcopy = Object.assign({}, basic);
            Clothcopy.clothing = d.ClothesandShoes
                clothData.push(Clothcopy)
        }
        if(d.Education>0){
            const Edcopy = Object.assign({}, basic);
            Edcopy.education = d.Education
            edData.push(Edcopy)
        }
        if (d.AgriculturalInputs >0 || d.BusinessVentures >0|| d.Saving>0|| d.MigantsComittments>0|| d.MigrationLoanDebt>0|| d.OtherDebts>0){
        const Othercopy = Object.assign({}, basic);
        Othercopy.other = 1
        otherData.push(Othercopy)} 

        if(d.Housing >0 || d.HousingRental >0 ||d.HomePurchase>0){
            const Housecopy = Object.assign({}, basic);
            Housecopy.housing = 1
            houseData.push(Housecopy)
        }
        console.log(otherData.length) 
    })
    
    
const nodes2 = [].concat(foodData,healthData,utilData,clothData,edData,houseData,otherData)
//console.log(nodes2)


    //window.addEventListener("resize", ready)
    svg2 = d3.select(".hist")
          .append("svg")
            .attr("width", width2)
            .attr("height", height2)
            .attr("viewBox", [0, 0, width2, height2])
            .call(responsivefy)
              .append("g")
              .attr('id','ex_hist')
              

              const forceXexpense = d3.forceX((d)=>{
                if ('food' in d){return expenseCenters.Food.x}
                else if ('health' in d){return expenseCenters.Health.x}
                else if ('utilities' in d){return expenseCenters.Utilities.x}
                else if ('education' in d){return expenseCenters.Education.x}
                else if ('clothing' in d){return expenseCenters.Clothing.x}
                else if ('other' in d){return expenseCenters.Other.x}
                else if ('housing' in d){return expenseCenters.Housing.x}
                else {return width2-0.4*width2 }}).strength(0.5)
              
    const simulation2 = d3.forceSimulation(nodes2)
            .velocityDecay(0.2)
            .force("x", forceXexpense)
            .force("y", d3.forceY(height2 / 3).strength(0.2))
            .force("collide", d3.forceCollide().radius(3.5).iterations(1))
            .force("charge", d3.forceManyBody().strength(-3))
            .alphaDecay(0.03)
            .velocityDecay(0.6)
            
    

    node = svg2.selectAll('circle').data(simulation2.nodes())
                            .enter().append('circle')
                            .style('fill',(d)=>{
                                if ('food' in d){return expenseCenters.Food.color}
                                else if ('health' in d){return expenseCenters.Health.color}
                                else if ('utilities' in d){return expenseCenters.Utilities.color}
                                else if ('education' in d){return expenseCenters.Education.color}
                                else if ('clothing' in d){return expenseCenters.Clothing.color}
                                else if ('other' in d){return expenseCenters.Other.color}
                                else if ('housing' in d){return expenseCenters.Housing.color}
                            })
                            .attr('r',r)

    simulation2.on("tick", function() {
                node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width2 - r, d.x)); })
                    .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height2 - r, d.y)); });
                        
                           }); 
 
    
    
const labels = svg2.selectAll("g")
                    .data(expenses)
                    .enter().append("g")

        labels.append("rect")
        .attr('fill',d=> d.color)
        .attr('width',80)
        .attr('height',25)
        .attr('x',d=>d.x-40)
        .attr('y',height2/1.5 )
        .append('text')
        
        labels.append('text')
     .attr('x',d=>d.x)//{if(d.ex_name=='Education'){return d.x-20}}
        .attr('y',height2/1.5+15 )
        .text(d=> d.ex_name)
        .attr('dominant-baseline','middle')
        .attr('text-anchor','middle')  
        .attr('fill','#ffffff')  

svg2.selectAll('circle')
.on('mouseover', mouseOver)
.on('mouseout', mouseOut)

function mouseOver(event, d){
    d3.select(this)
    .transition('mouseover').duration(500)
    .attr('opacity', 1)
    .attr('stroke-width', 2)
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
        <br> <b>Household Remittances to Household Income Ratio:</b> ${Math.round(RemitToIncomeRatio * 100) / 100}
        `)
        }
//         <br> <b>Household Remittances to Household Income Ratio:</b> ${RemitToIncomeRatio<=1? 'Remittances make up '+RemitPCT+'% of the Household Income' :'Remittances are '+RemitPCT+'% more than the Household Income'}

function mouseOut(event, d){
    tooldiv.style('visibility','hidden')
    
    d3.select(this)
        .transition('mouseout').duration(500)
        .attr('opacity', 1)
        .attr('stroke-width', 0)}
    


 
  });

//   const circles = svg.selectAll(".Household")
//                         .data(datapoints)
//                         .enter()
//                         .append("circle")
//                             .attr("class","need")
//                             .attr("id",(d)=>d.Household)
//                             .attr("r",rad) //(d)=>radiusScale(d.Food)
//                             .attr("fill",first_color)//(d)=>colors[d.country]'