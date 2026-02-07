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

function getUrl(img) { 
    const data = btoa(img);
    const url = `data:image/svg+xml;base64,${data}`;
    return url
}

function createSvgUrl(w, h, data) {
    const padding = 4;
    let img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" 
viewBox="-${padding} -${padding} ${w+padding*2} ${h+padding*2}">
${data}
</svg>
`
    return getUrl(img);
}

function generateJitterBorder(w, h, width=1) {
    const x1 = 0, y1 = 0, x2 = w, y2 = 0, x3 = w, y3 = h, x4 = 0, y4 = h;

    function stroke(x1, y1, x2, y2) {
        jmax = 10;
        let j1, j2, j3, j4;
        j1 = jitter(jmax); j2 = jitter(jmax); j3 = jitter(jmax); j4 = jitter(jmax); 
        return `<path d="M ${x1+j3} ${y1+j3} C ${x1+j1} ${y1+j1}, ${x2+j2} ${y2+j2}, ${x2+j4} ${y2+j4}" 
        stroke="url(#e)" stroke-width="${width}" fill="none"/>`

    }

    const grad1 = randInt(0, 100);
    const grad2 = randInt(0, 100);
    let img = `
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

    return img;
}

function generateJitterBackground(w, h, color) {
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
    const startColor = color ?? randGray(150, 200)
    const endColor = color ?? randGray(150, 200)

    const img = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" 
viewBox="-${padding} -${padding} ${w+padding*2} ${h+padding*2}">
<style>
.stop1 { stop-color: ${startColor} }
.stop2 { stop-color: ${endColor} }
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

function setBtnBorder(elem, strokeWidth, outset=0) {
    const styles = getComputedStyle(elem);
    const bw = styles.borderWidth;
    const ow = styles.outlineWidth;
    const w = elem.clientWidth;
    const h = elem.clientHeight;
    let img = generateJitterBorder(w, h, strokeWidth);
    let borders = elem.dataset.borders ?? "";
    borders += img;
    elem.dataset.borders = borders;
    let url = createSvgUrl(w, h, borders);
    elem.style.setProperty("border-image-source", `url("${url}")`);
    elem.style.setProperty("border-image-width", "10px");    
    elem.style.setProperty("border-image-slice", "10");
    elem.style.setProperty("border-image-outset", `${outset}px`);
    elem.style.setProperty("border-radius", "0px");
    elem.style.setProperty("outline-width", "0px");
}

function setBtnBackground(elem) {
    const styles = getComputedStyle(elem);
    const color = styles.backgroundColor;
    const w = elem.clientWidth;
    const h = elem.clientHeight;
    const img = generateJitterBackground(w, h, color);
    const url = getUrl(img)
    elem.style.setProperty("background-image", `url("${url}")`)
    elem.style.setProperty("background-repeat", "no-repeat")
    elem.style.setProperty("background-color", "unset")
    elem.style.setProperty("background-size", "contain")
}

function setBtnPosition(elem) {
    const deg = jitter(5*100/elem.clientWidth)
    elem.style.setProperty("transform", `rotate(${deg}deg)`)
}

function patchButton(elem) {
    elem.dataset.handPatched = true
    setBtnBorder(elem)
    setBtnBackground(elem)
    setBtnPosition(elem)
    elem.addEventListener("click", (evt) => {
        setBtnBorder(evt.currentTarget, 0.3)
    })
}

function patchNdlInput(elem) {
    elem.dataset.handPatched = true
    setBtnBorder(elem, 1, 4)
    elem.addEventListener("click", (evt) => {
        setBtnBorder(evt.currentTarget, 0.3, 4)
    })
}

function patchNdlModal(elem) {
    elem.dataset.handPatched = true
    setBtnBorder(elem)
}

function patchNdlSelect(elem) {
    elem.dataset.handPatched = true
    setBtnBorder(elem)
}

const dirtyElements = new Set()

function markDirty(elem) {
    dirtyElements.add(elem)
    requestAnimationFrame(patchDirty)
}

function patchDirty() {
    dirtyElements.forEach((elem) => {
        if (elem.classList.contains('ndl-icon-btn')) {
            return
        }
        if (elem.matches?.("button")) {
            patchButton(elem)
        }
        if (elem.classList.contains('ndl-input-wrapper')) {
            patchNdlInput(elem)
        }
        if (elem.classList.contains('ndl-modal')) {
            patchNdlModal(elem)
        }
        if (elem.classList.contains('ndl-menu')) {
            patchNdlModal(elem)
        }
        if (elem.classList.contains('ndl-select-control')) {
            patchNdlSelect(elem)
        }
    })
    dirtyElements.clear()
}

function markAll() {
    const elements = document.querySelectorAll("*");
    elements.forEach(markDirty)
}

function initHanddraw() {
    function observe(mutations) {
        for (const m of mutations) {
            if (m.type === "childList") {
                m.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        markDirty(node)
                        node.querySelectorAll?.("*").forEach(markDirty);
                    }
                })
            }
            if (m.type === "attributes" && m.target.nodeType === 1 && !m.target.dataset.handPatched) {
                markDirty(m.target)
            }
        }
    }
    const observer = new MutationObserver(observe)
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    markAll()
}

document.addEventListener("DOMContentLoaded", function () {
    initHanddraw()
    //setImgSrc()
    //drawBorders()
});
