let LastTouchUpdate={x:null,y:null};
let LastZoomFingers={m:{x:null,y:null},n:{x:null,y:null},scale:1,angle:0};
let TouchState="Free",ZoomState="Free";

this.addEventListener("touchstart",function(Event){
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

this.addEventListener("touchmove",function(Event){
  if(Event.touches.length==1 && TouchState=="Occupied"){
    LastTouchUpdate.x=Event.touches[0].clientX;
    LastTouchUpdate.y=Event.touches[0].clientY;
    TouchUpdate(LastTouchUpdate);
  }
  if(Event.touches.length==2 && ZoomState=="Occupied"){
    LastZoomFingers.scale*=Math.sqrt(((Event.touches[0].clientX-Event.touches[1].clientX)**2+(Event.touches[0].clientY-Event.touches[1].clientY)**2)/((LastZoomFingers.m.x-LastZoomFingers.n.x)**2+(LastZoomFingers.m.y-LastZoomFingers.n.y)**2));
    // Change in angle is not being calculated right now.
    ZoomUpdate(LastZoomFingers,LastTouchUpdate);
    LastZoomFingers.m.x=Event.touches[0].clientX;
    LastZoomFingers.m.y=Event.touches[0].clientY;
    LastZoomFingers.n.x=Event.touches[1].clientX;
    LastZoomFingers.n.y=Event.touches[1].clientY;
  }
});

this.addEventListener("touchend",function(Event){
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
