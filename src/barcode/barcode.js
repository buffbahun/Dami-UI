import { chooseEncodingType } from "./encoding-service";

const svgns = "http://www.w3.org/2000/svg";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        svg {
            border: solid 1px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
    </style>
    <svg xmlns="${svgns}"></svg>
`

class DamiBarcode extends HTMLElement {
    constructor() {
        super();
        this.initShadow();

        this.xyPadding = 10;

        this.width = 300;
        this.height = 300 / 3;
        this.color = "black";
        this.background = "white";
        this.font = "Consolas, Monaco, Sans Mono, monospace, sans-serif";
    }

    initShadow() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.svgElm = shadow.querySelector("svg");
    }

    initSvgSize() {
        const width = this.getAttribute("width") ? Number(this.getAttribute("width")) : this.width;
        const height = this.getAttribute("height") ? Number(this.getAttribute("height")) : Math.trunc(width / 3);

        if (typeof width === "number" && typeof height === "number") {
            this.svgElm.setAttribute("width", width);
            this.svgElm.setAttribute("height", height);
        } else {
            console.error("Enter both width and height and all numbers.");
        }
    }

    initRectWithSize(x, y, width, height, color) {
        const rectElm = document.createElementNS(svgns, "rect");

        rectElm.setAttribute("width", width);
        rectElm.setAttribute("height", height);

        rectElm.setAttribute("x", x);
        rectElm.setAttribute("y", y);
        
        rectElm.setAttribute("fill", color);

        return rectElm;
    }

    connectedCallback() {
        this.initSvgSize();

        const background = this.getAttribute("background") ? this.getAttribute("background") : this.background;
        this.svgElm.style.background = background;

        this.drawBarcode();
    }

    static get observedAttributes() {
        return ["width", "height", "type", "value", "color", "background"];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        
    }

    drawBarcode() {
        if (this.getAttribute("type") && this.getAttribute("value")) {
            const encodingValAndChksum = chooseEncodingType(this.getAttribute("type"), this.getAttribute("value"));

            const value = !this.hasAttribute("no-text") ? this.getAttribute("value") : "";
            const checksum = !this.hasAttribute("no-checksum") && !this.hasAttribute("no-text") ? encodingValAndChksum?.[1] : "";

            if (!encodingValAndChksum || !encodingValAndChksum?.[0]) return;

            this.fillRectBlocks(encodingValAndChksum[0]);
            this.createTextCenterBottom(value, checksum);
        } else {
            console.error("Properly enter type and value property for barcode.");
        }
    }

    fillRectBlocks(codeValue) {
        const rectDimention = this.getRectDimentions(codeValue.length);
        const startPos = this.getRectStartPos();

        const rectBlocks = this.makeRectBlocks(codeValue);

        const color = this.getAttribute("color") ? this.getAttribute("color") : this.color;
        const background = this.getAttribute("background") ? this.getAttribute("background") : this.background;

        let swt = true;

        rectBlocks.forEach(blockLen => {
            const width = rectDimention[0] * blockLen;
            const height = rectDimention[1];

            const startX = startPos[0];
            const startY = startPos[1];

            const rectElm = this.initRectWithSize(startX, startY, width, height, swt ? color : background);
            this.svgElm.appendChild(rectElm);

            startPos[0] += width;

            swt = !swt;
        });
    }

    makeRectBlocks(codeValue) {
        let checkVal = null;
        const blockAry = [];

        codeValue.split("").forEach(code => {
            if (checkVal !== code) {
                checkVal = code;
                blockAry.push(1);
            } else {
                blockAry[blockAry.length - 1]++;
            }
        });

        return blockAry;
    }

    getSvgDimentions() {
        const width = this.svgElm?.clientWidth;
        const height = this.svgElm?.clientHeight;
    
        if (width === undefined || height === undefined) return;
        return [width, height];
    }

    getRectDimentions(noOfRect) {
        const xPaddingPct = this.xyPadding * 2;
        const yPaddingPct = this.xyPadding * 2 * 2;
    
        const svgDimentions = this.getSvgDimentions();
    
        if (!svgDimentions) return;
    
        const contWidth = ( (100 - xPaddingPct) * svgDimentions[0] ) / 100;
        const contHeight = ( (100 - yPaddingPct) * svgDimentions[1] ) / 100;
    
        return [contWidth / noOfRect, contHeight];
    }

    getRectStartPos() {
        const svgDimentions = this.getSvgDimentions();
    
        if (!svgDimentions) return;
    
        return [( this.xyPadding * svgDimentions[0] / 100),
                ( this.xyPadding * svgDimentions[1] ) / 100];
    }

    createTextCenterBottom(value, checksum) {
        const textElm = document.createElementNS(svgns, "text");



        const color = this.getAttribute("color") ? this.getAttribute("color") : this.color;
        const font = this.getAttribute("font") ? this.getAttribute("font") : this.font;

        textElm.setAttribute("text-anchor", "middle");
        textElm.setAttribute("dominant-baseline", "middle");
    
        textElm.setAttribute("x", "50%");
        textElm.setAttribute("y", "90%");
        textElm.setAttribute("fill", `${color}`);
        textElm.setAttribute("font-size", `${0.05 * (this.svgElm?.clientWidth ?? 0)}`);
        textElm.setAttribute("font-family", `${font}`);
        
        var textNode = document.createTextNode(value.trim() + checksum.trim());
        textElm.appendChild(textNode);
    
        this.svgElm.appendChild(textElm);
    }

}

customElements.define("dami-barcode", DamiBarcode);
