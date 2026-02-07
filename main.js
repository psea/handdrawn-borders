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

function generateJitterBorder(w, h, width=1) {
    const x1 = 0, y1 = 0, x2 = w, y2 = 0, x3 = w, y3 = h, x4 = 0, y4 = h;

    function jitter(max=15) {
        return Math.random()*max - max/2;
    }

    function stroke(x1, y1, x2, y2) {
        jmax = 10;
        let j1, j2, j3, j4;
        j1 = jitter(jmax); j2 = jitter(jmax); j3 = jitter(jmax); j4 = jitter(jmax); 
        return `<path d="M${x1+j3},${y1+j3} C${x1+j1},${y1+j1} ${x2+j2},${y2+j2} ${x2+j4},${y2+j4}" 
        stroke="black" stroke-width="${width}" fill="none" />`

    }
    let img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="-5 -5 ${w+10} ${h+10}">
`
    img += stroke(x1, y1, x2, y2)
    img += stroke(x2, y2, x3, y3)
    img += stroke(x3, y3, x4, y4)
    img += stroke(x4, y4, x1, y1)

    img += '</svg>'

    return img;
}

function setImgSrc() {
    const imgElem = document.getElementById("preview");
    const img = generateStraightBorder(78, 41)
    const data = btoa(img);
    const url = `data:image/svg+xml;base64,${data}`
    imgElem.src = url;
}

function setBtnBorder(elem) {
    const img = generateJitterBorder(elem.clientWidth, elem.clientHeight);
    const data = btoa(img);
    const url = `data:image/svg+xml;base64,${data}`;
    elem.style.setProperty("border-image-source", `url("${url}")`);
    elem.style.setProperty("border-image-width", "10px");    
    elem.style.setProperty("border-image-slice", "10");
    elem.style.setProperty("border-image-outset", "5px");
    elem.style.setProperty("border-radius", "0px");
}

function drawBorders() {
        const elements = document.querySelectorAll("button, .ndl-input-wrapper, .ndl-modal, .ndl-select-control");
    elements.forEach((elem) => {
        setBtnBorder(elem)
        elem.addEventListener("mouseover", (evt) => {
            //evt.stopPropagation();
            setBtnBorder(evt.currentTarget)
        })
        elem.addEventListener("click", (evt) => {
            //evt.stopPropagation();
            setBtnBorder(evt.currentTarget)
        })
    })
}

document.addEventListener("DOMContentLoaded", function () {
    setImgSrc()
    drawBorders()
});
