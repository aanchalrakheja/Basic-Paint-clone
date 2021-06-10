var file=document.getElementById("file");
var home=document.getElementById("home");
var view=document.getElementById("view");
var file_bar=document.getElementById("file-bar");
var home_bar=document.getElementById("tool-bar");
var view_bar=document.getElementById("view-bar");
var activeElement=document.getElementById("active-tool");
var brush=document.getElementById("brush");
var brushSize=document.getElementById("brush-size");
var brushColor=document.getElementById("brush-color");
var brushSizeRanger=document.getElementById("size-ranger");
var bucket=document.getElementById("bucket");
var bucketColor=document.getElementById("bucket-color");
var eraser=document.getElementById("eraser");
var upload=document.getElementById("upload");
var download=document.getElementById("download");
var deleteIcon=document.getElementById("delete");
var save=document.getElementById("save");
var refresh=document.getElementById("refresh");
var undo=document.getElementById("undo");
var redo=document.getElementById("redo");
var zoomIn=document.getElementById("zoom-in");
var zoomOut=document.getElementById("zoom-out");
var downloadInComputer=document.getElementById("downloadInComputer");

// Global variables
const canvas=document.createElement("canvas");
const context=canvas.getContext("2d");
canvas.id="canvas";
let currentSize=10;
let CurrentBucketColor="#FFFFFF";
let currentColor="#783478";
var isMouseDown=false;
var saveArray=[];
saveArray.push(0);
var isEraser=false;
var isundo=false;

view_bar.style.visibility="hidden";
file_bar.style.visibility="hidden";

//------------------------------------------------- working of menu bar------------------------------------------------
file.addEventListener("click",function(){
    file.style.backgroundColor="lightgrey";
    file.style.borderTop="1px solid black";
    file.style.borderRight="1px solid black";
    file.style.borderLeft="1px solid black";
    home.style.border="0px";
    home.style.backgroundColor="white";
    view.style.border="0px";
    view.style.backgroundColor="white";
    file_bar.style.visibility="visible";
    view_bar.style.visibility="hidden";
    home_bar.style.visibility="hidden";
});

view.addEventListener("click",function(){
    view.style.backgroundColor="lightgrey";
    view.style.borderTop="1px solid black";
    view.style.borderRight="1px solid black";
    view.style.borderLeft="1px solid black";
    home.style.border="0px";
    home.style.backgroundColor="white";
    file.style.border="0px";
    file.style.backgroundColor="white";
    file_bar.style.visibility="hidden";
    view_bar.style.visibility="visible";
    home_bar.style.visibility="hidden"; 
});

home.addEventListener("click",function(){
    home.style.backgroundColor="lightgrey";
    home.style.borderTop="1px solid black";
    home.style.borderRight="1px solid black";
    home.style.borderLeft="1px solid black";
    view.style.border="0px";
    view.style.backgroundColor="white";
    file.style.border="0px";
    file.style.backgroundColor="white";
    file_bar.style.visibility="hidden";
    view_bar.style.visibility="hidden";
    home_bar.style.visibility="visible";
});



//--------------------------------------------- HOME MENU FUNCTIONALITY------------------------------------------------

// event on clicking on brush icon
brush.addEventListener("click",function(){
    switchtoBrush();
    eraser.style.color="black";
    eraser.style.backgroundColor="lightgrey";
});
// function to handle the changing bucket color
bucketColor.addEventListener("change",function()
{
    CurrentBucketColor=`#${bucketColor.value}`;
    bucket.style.backgroundColor="black";
    bucket.style.color="white";
    brush.style.backgroundColor="lightgrey";
    brush.style.color="black";
    eraser.style.backgroundColor="lightgrey";
    eraser.style.color="black";
    // createCanvas();
    context.fillStyle=CurrentBucketColor;
    context.fillRect(0,0,canvas.width,canvas.height);
    restoreCanvas();
});

// switching back to brush tool
function switchtoBrush()
{
    isEraser=false;
    activeElement.textContent="BRUSH";
    brush.style.color="white";
    brush.style.backgroundColor="black";
    currentColor=`#${brushColor.value}`;
    currentSize=10;
    brushSize.innerText=currentSize;
    brushSizeRanger.value=currentSize;
}
// event on clicking eraser button
eraser.addEventListener("click",function(){
    isEraser=true;
    activeElement.textContent="ERASER";
    currentColor=`#${bucketColor.value}`;
    brush.style.backgroundColor="lightgrey";
    brush.style.color="black";
    bucket.style.backgroundColor="lightgrey";
    bucket.style.color="black";
    eraser.style.backgroundColor="black";
    eraser.style.color="white";
    // currentSize=50;
    brushSize.innerText=currentSize;
    brushSizeRanger.value=currentSize;
});
// event on changing brush color
brushColor.addEventListener("change",function(){
    currentColor=`#${brushColor.value}`;
    brush.style.color=`#${brushColor.value}`;
});

// setting brush size
brushSizeRanger.addEventListener("change",function()
{
    currentSize=brushSizeRanger.value;
    if(currentSize<10)
    {
        brushSize.innerText=`0${currentSize}`;
    }
    else{
        brushSize.innerText=currentSize;
    }
});
// Track the cursor movement
function getCursorMovement(event)
{
    const boundaries = canvas.getBoundingClientRect();
    return{
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}

// track the mousedown event
canvas.addEventListener("mousedown",function(event){
    isMouseDown=true;
    var cursorPosition1=getCursorMovement(event);
    context.beginPath();
    context.moveTo(cursorPosition1.x,cursorPosition1.y);
    context.lineCap="round";
    context.lineWidth=currentSize;
    context.strokeStyle=currentColor;
    context.lineTo(cursorPosition1.x,cursorPosition1.y);
    context.stroke();
});

function saveDrawing(x,y,color,size,eraserSelect)
{
    const line={
        x,y,color,size,eraserSelect
    };
    saveArray.push(line);
}
// the mouse move event over the canvas
canvas.addEventListener("mousemove",function(event){
    if(isMouseDown)
    {
        var cursorPosition2=getCursorMovement(event);
        context.lineTo(cursorPosition2.x,cursorPosition2.y);
        context.stroke();
        saveDrawing(
            cursorPosition2.x,
            cursorPosition2.y,
            currentColor,
            currentSize,
            isEraser
        );
    }
    // else{
    //     saveDrawing(undefined);
    // }
});
// mouse up event
canvas.addEventListener("mouseup",function()
{
    isMouseDown=false;
    saveArray.push(0);
    console.log(saveArray);
    isundo=true;
    EnableUndoRedo();
});

// undo functionality
var arr=[];
function EnableUndoRedo()
{
if(saveArray.length<2 || isundo===false)
{
    undo.style.backgroundColor="grey";
    undo.style.color="red";
    redo.style.backgroundColor="grey";
    redo.style.color="red";
}
else{
    undo.style.backgroundColor="lightgrey";
    undo.style.color="black";
}
}
undo.addEventListener("click",function(){
 if(isundo===true)
 {
    arr=[];
    redo.style.backgroundColor="grey";
    redo.style.color="red";
    if(saveArray.length>=2){
    for(var i=saveArray.length-2;saveArray[i]!==0;i--)
    {
        arr.push(saveArray[i]);
    }
    console.log(arr);
    for(var j=1;j<arr.length;j++)
    {
    context.beginPath();
        context.moveTo(arr[j-1].x,arr[j-1].y);
        context.lineCap="round";
        context.lineWidth=arr[j].size;
        if(arr[j].eraserSelect)
        {
            context.strokeStyle=`#${brushColor.value}`;
        }
        else{
            context.lineWidth=50;
            context.strokeStyle=CurrentBucketColor;
        }
        context.lineTo(arr[j].x,arr[j].y);
        context.stroke();
    }
    isundo=false;
    EnableUndoRedo();
    redo.style.backgroundColor="lightgrey";
    redo.style.color="black";
}
 }
});


// redo functionality
redo.addEventListener("click",function(){
    if(redo.style.backgroundColor==="lightgrey" && redo.style.color==="black")
    {
        for(var j=1;j<arr.length;j++)
        {
            context.beginPath();
        context.moveTo(arr[j-1].x,arr[j-1].y);
        context.lineCap="round";
        context.lineWidth=arr[j].size;
        if(arr[j].eraserSelect)
        {
            context.strokeStyle=CurrentBucketColor;
        }
        else{
            context.strokeStyle=arr[j].color;
        }
        context.lineTo(arr[j].x,arr[j].y);
        context.stroke();
        }
    }
    redo.style.backgroundColor="grey";
    redo.style.color="red";
    isundo=true;
    EnableUndoRedo();
});


//---------------------------------------------- VIEW MENU FUNCTIONALITY--------------------------------------------------
// zoom in function
zoomIn.addEventListener("click",function()
{
    canvas.width=canvas.width*1.25;
    canvas.height=canvas.height*1.25;
    context.fillStyle=`#${bucketColor.value}`;
    context.fillRect(0,0,canvas.width,canvas.height);
    restoreCanvas();
});

// zoom out fuction
zoomOut.addEventListener("click",function()
{
    canvas.width=canvas.width/1.25;
    canvas.height=canvas.height/1.25;
    context.fillStyle=`#${bucketColor.value}`;
    context.fillRect(0,0,canvas.width,canvas.height);
    restoreCanvas();
});



// ---------------------------------------FILE MENU FUNCTIONALITY---------------------------------------------------
// refresh fuction
refresh.addEventListener("click",function()
{
    CurrentBucketColor="white";
    createCanvas();
    saveArray=[];
});
// upload drawing to local storage

upload.addEventListener("click",function(){
    localStorage.setItem("savedCanvas",JSON.stringify(saveArray));
    alert("Saved in local storage");
    setTimeout(switchtoBrush,1500);
});
// download file from local storage
download.addEventListener("click",function(){
    if(localStorage.getItem(savedCanvas)){
        saveArray=JSON.parse(localStorage.savedCanvas);
        restoreCanvas();
    }
    else{
       alert("Nothing found in local storage");
    }
});
// empty local storage
deleteIcon.addEventListener("click",function(){
    localStorage.removeItem("savedCanvas");
    i=0;
});

// event to save and download the file
save.addEventListener("click",function()
{
    downloadInComputer.href=canvas.toDataURL("image/jpeg",1);
    downloadInComputer.download="download.jpeg";
});
// -------------------------------------------BASIC FUNCTIONS NEEDED-----------------------------------------------
// function to retrieve the canvas data
function restoreCanvas(){
    for(var i=1;i<saveArray.length;i++)
    {
        context.beginPath();
        context.moveTo(saveArray[i-1].x,saveArray[i-1].y);
        context.lineCap="round";
        context.lineWidth=saveArray[i].size;
        if(saveArray[i].eraserSelect)
        {
            context.strokeStyle=CurrentBucketColor;
        }
        else{
            context.strokeStyle=saveArray[i].color;
        }
        context.lineTo(saveArray[i].x,saveArray[i].y);
        context.stroke();
    }
}
// function to empty the local storage on refreshing the page everytime
window.onload=function()
{
    localStorage.removeItem("savedCanvas");
}

// function to create canvas
function createCanvas()
{
    canvas.width=600;
    canvas.height=300;
    context.fillStyle=CurrentBucketColor;
    context.fillRect(0,0,canvas.width,canvas.height);
    document.body.appendChild(canvas);
    switchtoBrush();
}

createCanvas();
EnableUndoRedo();
