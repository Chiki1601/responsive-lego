let select = function(s) {
    return document.querySelector(s);
  };
let animationWindow = select('#animationWindow');
let anim = lottie.loadAnimation({
   container: animationWindow, 
   renderer: 'svg',
   loop: false,
   autoplay: false,
    rendererSettings: {
     //className:'mainSVG'
    },
   path:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/responsive_lego_003.json' 
});
var snapValue,
    maxX,
    tl,
    handle = document.querySelector('.handle'), 
    numStages,
    handleTextArray = [1,2,4,6,8,10,12,14,16],
    dimpleArray = [
     [{x:416, y:310}],
     [{x:418, y:280}],
     [{x:413, y:305}, {x:437, y:281}],
     [{x:425, y:314}, {x:452, y:293}],
     [{x:438, y:321}, {x:464, y:302}],
     [{x:451, y:332}, {x:478, y:312}],
     [{x:462, y:339}, {x:489, y:319}],
     [{x:474, y:349}, {x:499, y:328}],
     [{x:486, y:358}, {x:512, y:338}]
    ],
    brickColorArray = [
     {side:'#DE002E', top:'#E42F3F', front:'#CD0022'},
     {side:'#F65F23', top:'#F99859', front:'#EC4518'},
     {side:'#9AC43D', top:'#A1D039', front:'#749426'},
     {side:'#5CAFCD', top:'#73D6F2', front:'#3787A8'},
     {side:'#F7E143', top:'#F8E944', front:'#E3B537'},
     {side:'#DE519B', top:'#F271AC', front:'#B1005E'}
                      ],
    handleText = document.querySelector('.handleText'),
    pop = document.querySelector('#pop'),
    dimple = document.querySelector('#dimple'),
    sliderSVG = document.querySelector('.sliderSVG'),
    allRects = document.querySelectorAll('.swatch rect')


TweenMax.set(handle, {
 x:0
})
TweenMax.set(dimple, {
 transformOrigin:'50% 50%'
})
anim.addEventListener("DOMLoaded", onLoaded);

function dragUpdate(){
 
 var posX = handle._gsTransform.x;
 var posY = handle._gsTransform.y;
 var id = (posX/maxX)*numStages;
 handleText.textContent = handleTextArray[id];

   var dragPercent = (posX/maxX);

   var playhead = dragPercent * (tl.duration()-(2));

   TweenMax.to(tl,1, {
    time:(playhead <= 0 ) ? 0 : playhead,
    ease:(playhead <= 0 ) ? Elastic.easeOut.config(0.1,1) : Elastic.easeOut.config(1,0.7)
   })
 
 
 var c = pop.cloneNode(true);
 sliderSVG.appendChild(c);
 TweenMax.fromTo(c, 2, {
  x:posX,
  attr:{
   r:20
  },
  alpha:1
  //y:posY
 },{
  x:posX,
  attr:{
   r:60
  },
  alpha:0,
  onComplete:removePop,
  onCompleteParams:[c],
  ease:Expo.easeOut
 })
 
 var d, dtl = new TimelineMax();
 for(var i = 0; i < dimpleArray[id].length; i++){
  
  d = dimple.cloneNode(true);
  sliderSVG.appendChild(d);
  var tween = TweenMax.fromTo(d, 1.7, {
   x:dimpleArray[id][i].x,
   y:dimpleArray[id][i].y-6,
   attr:{
    r:10
   },
   alpha:1,
   skewX:50,
   rotation:-20
  },{
   attr:{
    r:35
   },
   alpha:0,
   onComplete:removePop,
   onCompleteParams:[d],
   ease:Expo.easeOut
  })
  
  dtl.add(tween, i/20)
  
 }
 
 

}

function removePop(c){
 sliderSVG.removeChild(c)
}

function onLoaded(e){
 
 var mainGroup = document.querySelectorAll('svg')[0].querySelectorAll('g')[0];
 
 //mainGroup.setAttribute('filter', 'url(#edgeClean)');
 
 TweenMax.staggerFrom(allRects, 2, {
  cycle:{
   alpha:function(i, t){
    t.setAttribute('fill-data', i);
    t.onclick = changeColour;
    //add colours as the hover title nodes
    var titleTag = document.createElementNS("http://www.w3.org/2000/svg", 'title');
    var desc = document.createTextNode(t.getAttribute('fill'));
    titleTag.appendChild(desc);
    t.appendChild(titleTag)
    
    return 0;
   }
  }
 },0.1)
 
 
 tl = new TimelineMax({paused:true});
 tl.to({frame:0},18, {
  frame:anim.totalFrames-1,
  ease:Linear.easeNone,
  onUpdate:function(){  
   anim.goToAndStop(Math.round(this.target.frame), true);
  }
 })
 
 handle = document.querySelector(".handle"), maxX = 400, numStages = 8, snapValue = maxX/numStages;

 
 Draggable.create(handle, {
  type:'x',
  cursor:'pointer',
  liveSnap:function(endValue){   
   return Math.round(endValue / snapValue) * snapValue;
  },
  bounds:{minX:0, maxX:maxX},
  onDrag:dragUpdate  
  
 })
 
 dragUpdate();
 changeColour({currentTarget:allRects[3]})
}

function changeColour(e){
 var id = parseInt(e.currentTarget.getAttribute('fill-data'));
 TweenMax.set('#dimple', {
  stroke:brickColorArray[id].front
 })
 TweenMax.set('svg:first-child g path', {
  fill:brickColorArray[id].front
 })
 TweenMax.set('.sideFace path', {
  fill:brickColorArray[id].side
 })
 TweenMax.set('.topFace path', {
  fill:brickColorArray[id].top
 })
 TweenMax.set('.frontFace path', {
  fill:brickColorArray[id].front
 })
 
TweenMax.staggerTo(allRects, 0.15, {
 cycle:{  
  scaleY:function(i, target){
   return (e.currentTarget == target) ? 1.3 : 1
  }
 },
 transformOrigin:'50% 100%'
},0) 
}

function getSnap() {
  var t = function(endValue) {
    return Math.round(endValue / snapValue) * snapValue;
  }
  return t;
}