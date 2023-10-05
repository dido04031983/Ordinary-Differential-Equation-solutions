let InteractiveElement=this;
let LastTouchUpdate={x:null,y:null};
let LastZoomFingers={m:{x:null,y:null},n:{x:null,y:null},scale:1,angle:0,translation:{x:0,y:0}};
let TouchState="Free",ZoomState="Free";

InteractiveElement.addEventListener("touchstart",function(Event){
  if(Event.touches.length==1 && TouchState=="Free"){
    LastTouchUpdate.x=Event.touches[0].clientX;
    LastTouchUpdate.y=Event.touches[0].clientY;
    TouchUpdate(LastTouchUpdate);
    TouchState="Occupied";
  }
  if(Event.touches.length==2 && TouchState=="Occupied"){
    TouchState="Overflow";
    LastZoomFingers.m.x=Event.touches[0].clientX;
    LastZoomFingers.m.y=Event.touches[0].clientY;
    LastZoomFingers.n.x=Event.touches[1].clientX;
    LastZoomFingers.n.y=Event.touches[1].clientY;
    ZoomState="Occupied";
  }
  if(Event.touches.length==3 && TouchState=="Overflow"){
    if(ZoomState=="Occupied"){
      LastZoomFingers.m.x=null;
      LastZoomFingers.m.y=null;
      LastZoomFingers.n.x=null;
      LastZoomFingers.n.y=null;
      ZoomState="Overflow";
    }
  }
});

InteractiveElement.addEventListener("touchmove",function(Event){
  if(Event.touches.length==1 && TouchState=="Occupied"){
    LastTouchUpdate.x=Event.touches[0].clientX;
    LastTouchUpdate.y=Event.touches[0].clientY;
    TouchUpdate(LastTouchUpdate);
  }
  if(Event.touches.length==2 && ZoomState=="Occupied"){
    const CurrentXDist=Event.touches[0].clientX-Event.touches[1].clientX;
    const CurrentYDist=Event.touches[0].clientY-Event.touches[1].clientY;
    const LastXDist=LastZoomFingers.m.x-LastZoomFingers.n.x;
    const LastYDist=LastZoomFingers.m.y-LastZoomFingers.n.y;
    LastZoomFingers.scale*=Math.sqrt((CurrentXDist**2+CurrentYDist**2)/(LastXDist**2+LastYDist**2));
    if(CurrentXDist!=0 && LastXDist!=0){
      LastZoomFingers.angle-=Math.atan2(CurrentYDist,CurrentXDist)-Math.atan2(LastYDist,LastXDist);
    }
    LastZoomFingers.translation.x+=(Event.touches[0].clientX+Event.touches[1].clientX-LastZoomFingers.m.x-LastZoomFingers.n.x)/2;
    LastZoomFingers.translation.y+=(Event.touches[0].clientY+Event.touches[1].clientY-LastZoomFingers.m.y-LastZoomFingers.n.y)/2;
    ZoomUpdate(LastZoomFingers,LastTouchUpdate);
    LastZoomFingers.m.x=Event.touches[0].clientX;
    LastZoomFingers.m.y=Event.touches[0].clientY;
    LastZoomFingers.n.x=Event.touches[1].clientX;
    LastZoomFingers.n.y=Event.touches[1].clientY;
  }
});

InteractiveElement.addEventListener("touchend",function(Event){
  if(Event.touches.length==0 && ZoomState=="Free"){
    TouchState="Free";
  }
  if(Event.touches.length==1 && ZoomState=="Occupied"){
    LastZoomFingers.m.x=null;
    LastZoomFingers.m.y=null;
    LastZoomFingers.n.x=null;
    LastZoomFingers.n.y=null;
    ZoomState="Free";
    LastTouchUpdate.x=Event.touches[0].clientX;
    LastTouchUpdate.y=Event.touches[0].clientY;
    TouchUpdate(LastTouchUpdate);
    TouchState="Occupied";
  }
  if(Event.touches.length==2 && ZoomState=="Overflow"){
    LastZoomFingers.m.x=Event.touches[0].clientX;
    LastZoomFingers.m.y=Event.touches[0].clientY;
    LastZoomFingers.n.x=Event.touches[1].clientX;
    LastZoomFingers.n.y=Event.touches[1].clientY;
    ZoomState="Occupied";
  }
});
