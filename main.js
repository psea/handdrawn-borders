function generateStraightBorder(w, h) {
    let img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <line x1="0" y1="0" x2="${w}" y2="0" stroke="black" stroke-width="2" />
  <line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="black" stroke-width="2" />
  <line x1="0" y1="0" x2="0" y2="${h}" stroke="black" stroke-width="2" />
  <line x1="${w}" y1="0" x2="${w}" y2="${h}" stroke="black" stroke-width="2" />
</svg>
    `
    return img;
}

function jitter(max=10) {
    return Math.random()*max - max/2;
}

function randInt(min=0, max=10) {
    return Math.round(min + Math.random()*(max-min));
}

function randGray(min=0, max=255) {
    const v = randInt(min, max);
    return `rgb(${v},${v},${v})`;
}

function getURL(img) { 
    const data = btoa(img);
    const url = `data:image/svg+xml;base64,${data}`;
    return url
}

function generateJitterBorder(w, h, width=1) {
    const x1 = 0, y1 = 0, x2 = w, y2 = 0, x3 = w, y3 = h, x4 = 0, y4 = h;

    function stroke(x1, y1, x2, y2) {
        jmax = 7;
        let j1, j2, j3, j4;
        j1 = jitter(jmax); j2 = jitter(jmax); j3 = jitter(jmax); j4 = jitter(jmax); 
        return `<path d="M ${x1+j3} ${y1+j3} C ${x1+j1} ${y1+j1}, ${x2+j2} ${y2+j2}, ${x2+j4} ${y2+j4}" 
        stroke="url(#e)" stroke-width="${width}" fill="none" />`

    }
    const padding = 3;

    const grad1 = randInt(0, 100);
    const grad2 = randInt(0, 100);
    let img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" 
viewBox="-${padding} -${padding} ${w+padding*2} ${h+padding*2}">
<defs>
    <linearGradient id="e" x1="${grad1}%" y1="${grad1}%" x2="${grad2}%" y2="${grad2}%" gradientUnits="userSpaceOnUse">
        <stop stop-color="black" offset="0" />
        <stop stop-color="#555555" offset="1" />
    </linearGradient>
</defs>
`
    img += stroke(x1, y1, x2, y2)
    img += stroke(x2, y2, x3, y3)
    img += stroke(x3, y3, x4, y4)
    img += stroke(x4, y4, x1, y1)

    img += '</svg>'

    return img;
}

function generateJitterBackground(w, h) {
    const x1 = 0, y1 = 0, x2 = w, y2 = 0, x3 = w, y3 = h, x4 = 0, y4 = h;

    jmax = 5;
    function strokeStart(x1, y1, x2, y2) {
        let j1, j2, j3, j4;
        j1 = jitter(jmax); j2 = jitter(jmax); j3 = jitter(jmax); 
        return `C ${x1+j1} ${y1+j1}, ${x2+j2} ${y2+j2}, ${x2+j3} ${y2+j3} `

    }
    function stroke(x, y) {
        let j1 = jitter(jmax), j2 = jitter(jmax); 
        return `S ${x+j1} ${y+j1}, ${x+j2} ${y+j2} `

    }
    function strokeEnd(x, y) {
        let j1 = jitter(jmax); 
        return `S ${x+j1} ${y+j1}, ${x} ${y} `

    }
    const j = jitter(jmax)
    let startX = x1 + j, startY = y1 + j;
    let path = `M ${startX},${startY} `
    path += strokeStart(startX, startY, x2, y2)
    path += stroke(x3, y3)
    path += stroke(x4, y4)
    path += strokeEnd(startX, startY)
    path += "Z"
 
    const padding = 3;

    const img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" 
viewBox="-${padding} -${padding} ${w+padding*2} ${h+padding*2}">
<style>
.stop1 { stop-color: ${randGray(150, 200)} }
.stop2 { stop-color: ${randGray(150, 200)} }
</style>
<defs>
    <linearGradient id="e" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
        <stop class="stop1" offset="0" />
        <stop class="stop2" offset="1" />
    </linearGradient>
</defs>
<path d="${path}" fill="url(#e)" />
</svg>`

    return img;
}

function setImgSrc() {
    const w = 78, h = 41;
    const imgElem = document.getElementById("preview");
    const img = generateJitterBackground(w, h)
    const data = btoa(img);
    const url = `data:image/svg+xml;base64,${data}`
    imgElem.src = url;
}

function setBtnBorder(elem) {
    const w = elem.clientWidth;
    const h = elem.clientHeight;
    let img = generateJitterBorder(w, h);
    let url = getURL(img)
    elem.style.setProperty("border-image-source", `url("${url}")`);
    elem.style.setProperty("border-image-width", "10px");    
    elem.style.setProperty("border-image-slice", "10");
    //elem.style.setProperty("border-image-outset", "5px");
    elem.style.setProperty("border-radius", "0px");
}

function setBtnBackground(elem) {
    const w = elem.clientWidth;
    const h = elem.clientHeight;
    const img = generateJitterBackground(w, h);
    const url = getURL(img)
    elem.style.setProperty("background-image", `url("${url}")`)
    elem.style.setProperty("background-repeat", "no-repeat")
    elem.style.setProperty("background-color", "unset")
    elem.style.setProperty("background-size", "contain")
    
}

function setBtnPosition(elem) {
    const deg = jitter(5)
    elem.style.setProperty("transform", `rotate(${deg}deg)`)
}

function drawBorders() {
        const elements = document.querySelectorAll("button, .ndl-input-wrapper, .ndl-modal, .ndl-select-control");
    elements.forEach((elem) => {
        setBtnBorder(elem);
        setBtnBackground(elem);
        setBtnPosition(elem);
        //elem.addEventListener("mouseover", (evt) => {
        //    //evt.stopPropagation();
        //    setBtnBorder(evt.currentTarget)
        //})
        elem.addEventListener("click", (evt) => {
            //evt.stopPropagation();
            setBtnBorder(evt.currentTarget)
            setBtnBackground(elem);
            setBtnPosition(elem);
        })
    })
}

document.addEventListener("DOMContentLoaded", function () {
    setImgSrc()
    drawBorders()
});
