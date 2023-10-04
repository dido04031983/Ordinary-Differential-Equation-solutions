// dy=Ax+By
// dx=Cx+Dy

const Scale=5;
const Accuracy=63;
const ParametricStart=-2.5;
const ParametricEnd=2.5;
const NoOfLines=100;
const GraphWidth=2;
const GraphColor="red";
const DifferentialEquation={
  A:1,B:0,
  C:0,D:-1
}

const MatrixMultiplication=function(Matrix_1,Matrix_2){
  const ResultantMatrix=[
    Matrix_1[0]*Matrix_2[0]+Matrix_1[1]*Matrix_2[2],
    Matrix_1[0]*Matrix_2[1]+Matrix_1[1]*Matrix_2[3],
    Matrix_1[2]*Matrix_2[0]+Matrix_1[3]*Matrix_2[2],
    Matrix_1[2]*Matrix_2[1]+Matrix_1[3]*Matrix_2[3]
  ];
  return ResultantMatrix;
};

const OrdinaryDifferentialEquation=function(z,w,x,y){
  const Equation={x:[],y:[],z:[],w:[]};
  let CurrentMatrix=[1,0,0,1],factorial=1;
  for(let i=0;i<Accuracy;i++){
    Equation.x.push(CurrentMatrix[0]/factorial);
    Equation.y.push(CurrentMatrix[1]/factorial);
    Equation.z.push(CurrentMatrix[2]/factorial);
    Equation.w.push(CurrentMatrix[3]/factorial);
    CurrentMatrix=MatrixMultiplication(CurrentMatrix,[x,y,z,w]);
    factorial*=i+1;
  }
  Equation.x.push(CurrentMatrix[0]/factorial);
    Equation.y.push(CurrentMatrix[1]/factorial);
    Equation.z.push(CurrentMatrix[2]/factorial);
    Equation.w.push(CurrentMatrix[3]/factorial);
  return Equation;
};

const OrdinaryDifferentialEquationExecuter=function(Equation,Vector,num){
  let CurrentMatrix=[Equation.x[0],Equation.y[0],Equation.z[0],Equation.w[0]];
  for(let i=0;i<Accuracy;i++){
    CurrentMatrix[0]+=Equation.x[i+1]*TimeHash[num][i];
    CurrentMatrix[1]+=Equation.y[i+1]*TimeHash[num][i];
    CurrentMatrix[2]+=Equation.z[i+1]*TimeHash[num][i];
    CurrentMatrix[3]+=Equation.w[i+1]*TimeHash[num][i];
  }
  ResultantVector={
    x:CurrentMatrix[0]*Vector.x+CurrentMatrix[1]*Vector.y,
    y:CurrentMatrix[2]*Vector.x+CurrentMatrix[3]*Vector.y
  };
  return ResultantVector;
};

const TimeVariableHash=function(){
  const Hash=[];
  for(let i=0;NoOfLines>=i;i++){
    Hash.push([]);
    const Power=ParametricStart+i*(ParametricEnd-ParametricStart)/NoOfLines;
    let CurrentPower=Power;
    for(let j=0;j<Accuracy;j++){
      Hash[i].push(CurrentPower);
      CurrentPower*=Power;
    }
  }
  return Hash;
};

const MatrixEquation=OrdinaryDifferentialEquation(DifferentialEquation.A,DifferentialEquation.B,DifferentialEquation.C,DifferentialEquation.D);

const TimeHash=TimeVariableHash();

const canvas=document.querySelector("canvas");
const ctx=canvas.getContext("2d");

canvas.width=this.innerWidth;
canvas.height=this.innerHeight;

const LastTouchUpdate={x:null,y:null};
const WidthInverse=1/canvas.width;

const PlotGraph=function(){
  const Points=[];
  const Position={x:Scale*(2*WidthInverse*LastTouchUpdate.x-1),y:Scale*WidthInverse*(-2*LastTouchUpdate.y+canvas.height)};
  for(let i=0;NoOfLines>=i;i++){
    Points.push(OrdinaryDifferentialEquationExecuter(MatrixEquation,Position,i));
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle=GraphColor;
  ctx.lineWidth=GraphWidth;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(0.5*canvas.width*(Points[0].x/Scale+1),-0.5*(canvas.width*Points[0].y/Scale-canvas.height));
  for(let i=1;i<Points.length;i++){
    ctx.lineTo(0.5*canvas.width*(Points[i].x/Scale+1),-0.5*(canvas.width*Points[i].y/Scale-canvas.height));
  }
  ctx.stroke();
};

let State="Free";

this.addEventListener("touchstart",Event=>{
  if(State=="Occupied"){
    return;
  }
  LastTouchUpdate.x=Event.touches[0].clientX;
  LastTouchUpdate.y=Event.touches[0].clientY;
  PlotGraph();
  State="Occupied";
});

this.addEventListener("touchmove",Event=>{
  LastTouchUpdate.x=Event.touches[0].clientX;
  LastTouchUpdate.y=Event.touches[0].clientY;
  PlotGraph();
  State="Occupied";
});

this.addEventListener("touchend",Event=>{
  if(Event.touches.length==0){
    State="Free";
  }
});