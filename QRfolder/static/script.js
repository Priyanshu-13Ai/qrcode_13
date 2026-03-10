let logoImage=""

const qr=new QRCodeStyling({

width:250,
height:250,

data:"",

image:"",

dotsOptions:{type:"square"},

backgroundOptions:{color:"#ffffff"}

})

qr.append(document.getElementById("qr-preview"))

function updateQR(){

const text=document.getElementById("data").value
const color=document.getElementById("color").value
const color2=document.getElementById("color2").value
const bg=document.getElementById("bg").value
const style=document.getElementById("style").value
const template=document.getElementById("template").value

let finalData=text

if(template==="wifi"){
finalData=`WIFI:T:WPA;S:${text};P:password;;`
}

if(template==="email"){
finalData=`mailto:${text}`
}

if(template==="whatsapp"){
finalData=`https://wa.me/${text}`
}

qr.update({

data:finalData,

image:logoImage,

imageOptions:{
margin:6,
imageSize:0.22
},

dotsOptions:{
type:style,
gradient:{
type:"linear",
rotation:0,
colorStops:[
{offset:0,color:color},
{offset:1,color:color2}
]
}
},

backgroundOptions:{color:bg}

})

trackQR(finalData)

}

document.querySelectorAll("input,select")
.forEach(el=>el.addEventListener("input",updateQR))

document.getElementById("logo")
.addEventListener("change",(e)=>{

const file=e.target.files[0]

if(!file) return

detectBrandColor(file)

const reader=new FileReader()

reader.onload=(event)=>{

logoImage=event.target.result
updateQR()

}

reader.readAsDataURL(file)

})

function detectBrandColor(file){

const img=new Image()

img.src=URL.createObjectURL(file)

img.onload=function(){

const colorThief=new ColorThief()

const palette=colorThief.getPalette(img,2)

const primary=palette[0]
const secondary=palette[1]

document.getElementById("color").value=
`rgb(${primary[0]},${primary[1]},${primary[2]})`

document.getElementById("color2").value=
`rgb(${secondary[0]},${secondary[1]},${secondary[2]})`

updateQR()

}

}

function downloadPNG(){
qr.download({name:"qr",extension:"png"})
}

function downloadSVG(){
qr.download({name:"qr",extension:"svg"})
}

function toggleDark(){

const html=document.documentElement

html.classList.toggle("dark")

if(html.classList.contains("dark")){
localStorage.setItem("theme","dark")
}else{
localStorage.setItem("theme","light")
}

}

if(localStorage.getItem("theme")==="dark"){
document.documentElement.classList.add("dark")
}

function trackQR(text){

fetch("/track",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({data:text})

})

}