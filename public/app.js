//popup intro
var speed = 40;
var i;
var txt;
var num;

function popup(text) {         
    i = 0;
    txt = text;  
    document.getElementById('type').innerHTML = '';
    num = text.length;
    popup2();
    document.querySelector('.textbox').classList.add('visible');
    document.querySelector('.question1').classList.add('visible');  
    document.querySelector('.exit').classList.add('visible');    
    document.querySelector('.dp').classList.add('grow');
    document.querySelector('#intro').style.top = '50%';
    
}
function popup2() {
  if (i < num) {
    document.getElementById("type").innerHTML += txt.charAt(i);    
    i++;
    speed = 50;
    setTimeout(popup2, speed);
  }
}
//combine the two fn
function close(el) {
    document.querySelector(el).style.display = 'none';
}

function exit() {
    document.querySelector('.textbox').classList.toggle('visible');
    document.querySelector('.dp').classList.toggle('grow');    
    document.querySelector('#intro').style.top = '90%';
}

function back() {
    if(document.querySelector('.back').style.display == "block") {
        x = chart_width / 2;
        y = chart_height / 2;
        k = 1;
        centered = null;
        close('.back');
    
        map.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });
        
        map.transition()
            .duration(750)
            .attr("transform", "translate(" + chart_width / 2 + "," + chart_height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }
}

var Country = function(name, description, food, foodCover, tipsCover, num, tips, pic, link ) {
    this.name = name;
    this.description = description;
    this.num = num;
    this.food = food;
    this.foodCover = foodCover;
    this.tipsCover = tipsCover;
    this.tips = tips;
    this.pic = pic;
    this.link = link;
}

Country.prototype.displayCountry = function() {
    
    var html = '<img class="countryPic" src="%pic%"/><div class="name">%name%</div><div class="description"><p>%description%</p></div><div class="buttons"><button id="foodLink" onclick="showTxt(\'%food%\', 0, \'.description\', \'%foodCover%\')">Target Foods</button><button id="tipsLink" onclick="showTxt(\'%tips%\', 0, \'.description\', \'%pic1%\')">Helpful Tips</button><button id="picsLink" onclick="showTxt(\'%link%\', 1, \'.description\', \'%pic2%\')">Pics</button></div>';
    newhtml = html.replace('%name%', this.name);
    newhtml = newhtml.replace('%description%', this.description);
    newhtml = newhtml.replace('%food%',this.food);
    newhtml = newhtml.replace('%foodCover%', this.foodCover);
    newhtml = newhtml.replace('%tips%', this.tips);
    newhtml = newhtml.replace('%pic%', this.pic);
    newhtml = newhtml.replace('%pic1%', this.tipsCover);
    newhtml = newhtml.replace('%pic2%', this.pic);    
    newhtml = newhtml.replace('%link%', this.link);
    
    return newhtml;   
}

function showTxt(arr, num, txtbox, newPic) {

    document.querySelector('#foodLink').style.background = 'white';
    document.querySelector('#picsLink').style.background = 'white';
    document.querySelector('#tipsLink').style.background = 'white';
    
    document.querySelector('#foodLink').style.color = '#00BCD4';
    document.querySelector('#picsLink').style.color = '#00BCD4';
    document.querySelector('#tipsLink').style.color = '#00BCD4';
    
    event.target.style.background = '#00BCD4';
    event.target.style.color = 'white';
        
    if(event.target.id == 'foodLink') {
        document.querySelector('.countryPic').setAttribute('src', newPic);
    } else {
        document.querySelector('.countryPic').setAttribute('src', newPic);        
    }
    
    if(num == 0) {
        arr = arr.split(',');

        if (arr.length == 1) {
            var arr1 = arr[0];
            document.querySelector(txtbox).innerHTML = arr;
        } else {
            var html = '<ul>';

            for(i=0; i<arr.length; i++) {
                html += '<li>' + arr[i] + '</li>';
            }   
            html += '</ul>';
            document.querySelector(txtbox).innerHTML = html;
        }
    } else if(num == 1) {
        html = '<p class="picDescrip">Check out <a class="linkpic" href="' + arr + '">' + 'some pics from this trip</a></p>';
        document.querySelector(txtbox).innerHTML = html;
    }
}


//FOR MAP 

var numCountry = 17;
var objs = [];

for(i = 0; i < numCountry; i++) {
    objs.push('country' + i);
}

// Width and height
var chart_width     =  1900; // window.innerWidth - 1900
var chart_height    =  1700; 
var centered;


var projection = d3.geoMercator()
.center([0,0])    
.scale((chart_width - 3) / (2 * Math.PI))
.rotate([-10,0])
.translate([chart_width / 2, chart_height / 2]);

var path = d3.geoPath()
.projection(projection);

// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr('viewBox', '-100 -30 2100 900')
    .attr('preserveAspect', 'xMidYMid');

var map             =   svg.append( 'g' )
    .attr( 'id', 'map' );


var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// load in data Data
d3.json( 'food_data.json', function( food_data ){
    //add data to the same cities in both dataset
    d3.json( 'world.json', function( world_data ){
        world_data.features.forEach(function(us_e, us_i){
            food_data.forEach(function(z_e,z_i){
                if( us_e.properties.name !== z_e.country ){
                    return null;
                }
                world_data.features[us_i].properties.num   =  z_e.num;
                world_data.features[us_i].properties.color  =  z_e.color;              
                world_data.features[us_i].properties.description  =  z_e.description;
                world_data.features[us_i].properties.food  =  z_e.food;
                world_data.features[us_i].properties.foodCover  =  z_e.foodCover;
                world_data.features[us_i].properties.tipsCover  =  z_e.tipsCover;                              
                world_data.features[us_i].properties.pic  =  z_e.pic;                
                world_data.features[us_i].properties.num  =  z_e.num;
                world_data.features[us_i].properties.tips =  z_e.tips;
                world_data.features[us_i].properties.link  =  z_e.link;              
            });
        });

        //apend data
        map.selectAll('path')
            .data( world_data.features )
            .enter()
            .append('path')
            .attr('class', 'path')
            .attr('d', path)
            .attr('fill', function( d, i ){
                var country = d.properties.num;
                return country ? d.properties.color : '#ddd'; //only color in those with data
            })
            .attr('stroke', function(d) {
                if(d.properties.name == 'Singapore') {
                    return "#ab91ce";
                } else {
                    return '#fff';
                }
            })
            .attr('stroke-width', function(d) {
                if(d.properties.name == 'Singapore') {
                    return 6;
                } else {
                    return 0.7;
                }
            })
            .on("mouseover", function(d, i) {    

                var country = d.properties.num;
                objs[d.num] = new Country(d.properties.name, d.properties.description, d.properties.food, d.properties.foodCover, d.properties.tipsCover, d.properties.num, d.properties.tips, d.properties.pic, d.properties.link).displayCountry()
                
                var node = document.createElement('p');
                node.setAttribute('id', 'closeTab')
                var textnode = document.createTextNode('x');
                node.appendChild(textnode);
                
                if(country) {
                    document.querySelector('body').style.cursor = "url(\"./pics/cursor.png\") 23 11, help";
                    tooltip.html(objs[d.num])
                        .style("left", (d3.event.pageX + 8) + "px")   
                        .style("top", (d3.event.pageY - 120) + "px");

                    tooltip.transition()
                        .duration(0)
                        .style('display', 'block')
                        .style('opacity', 1)
                    document.querySelector('.tooltip').appendChild(node);
                    document.querySelector('#closeTab').addEventListener('click', function() {
                        close('.tooltip');
                    })                     

                } else {
                    document.querySelector('body').style.cursor =   "url(\"./pics/glass.png\") 23 23, help";
                    close('.tooltip');  
                }
            })
            .on("click", function(d) {
                                    
                var x, y, k;
                
                document.querySelector('.back').style.display = 'block';                
                
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;

                map.transition()
                    .duration(500)
                    .attr("transform", "translate(" + chart_width / 2 + "," + chart_height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                    .style("stroke-width", 1.5 / k + "px");
    
            });
    
    });
});
