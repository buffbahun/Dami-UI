import { qrEncodedData, getFinalQrAry } from "./encoding-service";
import {Alignment_Pattern_Locations_Table} from "./encoding-structure";

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

class DamiQrcode extends HTMLElement {
    constructor() {
        super();
        this.initShadow();

        this.xyPadding = 10;
        this.qrSize;
        this.dataIds = [];

        this.size = 300;
        this.color = "black";
        this.background = "white";
        this.errorCorrection = "L";
        this.value = "";
    }

    initShadow() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.svgElm = shadow.querySelector("svg");
    }

    initSvgSize() {
        const width = this.getAttribute("size") ? Number(this.getAttribute("size")) : this.size;

        if (typeof width === "number") {
            this.svgElm.setAttribute("width", width);
            this.svgElm.setAttribute("height", width);
        } else {
            console.error("Enter both width and height and all numbers.");
        }
    }

    connectedCallback() {
        const value = this.getAttribute("value") ? this.getAttribute("value") : this.value;
        const errorCorrection = this.getAttribute("errorCorrection") ? this.getAttribute("errorCorrection") : this.errorCorrection;
        const color = this.getAttribute("color") ? this.getAttribute("color") : this.color;
        const background = this.getAttribute("background") ? this.getAttribute("background") : this.background;

        this.svgElm.style.background = background;

        this.initSvgSize();

        const {data, version} = qrEncodedData(value, errorCorrection);

        this.initQr(version);

        this.addFinderPatternWithSeparator();

        this.addAlignmentPatterns(version);

        this.addTimingPatterns();

        this.addDarkModule(version);

        const formatInfoIds = this.reserveFormatInformationArea();
        const versionInfoIds =this.reserveVersionInformationArea(version);
        const reservedIds = [...formatInfoIds, ...versionInfoIds];

        this.placeDataBits(data, reservedIds);

        const dataMap = this.qrDataMap();

        const testAry = getFinalQrAry(dataMap, this.qrSize, this.dataIds, errorCorrection, version);

        for (let i = 0; i < this.qrSize * this.qrSize; i++) {
            this.svgElm.getElementById(i).setAttribute("fill",testAry[i] === 1 ? color : background);
        }
    }

    static get observedAttributes() {
        return [];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        
    }

    initQr(version) {
        const qrSize = ((version - 1) * 4) + 21;
        this.qrSize = qrSize;

        const [startX, startY] = this.getRectStartPos();
        const [width, height] = this.getRectDimentions(qrSize);

        for (let i = 0; i < qrSize; i++) {
            for (let j = 0; j < qrSize; j++) {
                const rect = this.initRectWithSize(startX + width * j, startY + height * i, width, height, i * qrSize + j);
                this.svgElm.appendChild(rect);
            }
        }
    }

    qrDataMap() {
        const dataMap = [];
        for (let id = 0; id < this.qrSize * this.qrSize; id++) {
            let bit;
            if (this.svgElm.getElementById(id).getAttribute("fill") === "black") bit = 1;
            else if (this.svgElm.getElementById(id).getAttribute("fill") === "white") bit = 0;
            else bit = -1;

            dataMap.push(bit);
        }

        return dataMap;
    }

    placeDataBits(data, reservedIds) {
        let x = this.qrSize - 1;
        let y = this.qrSize - 1;

        let left = true;
        let up = true;

        while (data.length > 0) {
            const id = x + (y * this.qrSize);

            const occupied = this.svgElm.getElementById(id).getAttribute("fill") !== "grey" || reservedIds.includes(id);
            if (!occupied) {
                const bit = data[0];
                data = data.slice(1);

                const color = bit === "1" ? "black" : "white";
                this.svgElm.getElementById(id).setAttribute("fill", color);
                this.dataIds.push(id);
            }

            if (left) {
                x--;
            } else {
                x++;
                up ? y-- : y++; 
            }
            left = !left;

            if (up && y < 0) {
                up = false;
                y = 0;
                x = x - 2;
            }
            if (!up && y > this.qrSize - 1) {
                up = true;
                y = this.qrSize - 1;
                x = x - 2;
            }

            if (id === 7) x--;
        }
    }

    reserveVersionInformationArea(version) {
        if (version < 7) return [];

        const qrSize = this.qrSize;

        const pattern1 = [63, 63, 63].map(int => int.toString(2).split(""));
        const idAry1 = this.squarePatternMaker(0, qrSize - 11, pattern1, qrSize, false);

        const pattern2 = [7, 7, 7, 7, 7, 7].map(int => int.toString(2).split(""));
        const idAry2 = this.squarePatternMaker(qrSize - 11, 0, pattern2, qrSize, false);

        return [...idAry1, ...idAry2];
    }

    reserveFormatInformationArea() {
        const posAry = [[0,8,"H", 9],[8,0,"V", 8],[this.qrSize -8, 8, "H", 8],[8, this.qrSize - 8, "V", 8]];
        const ids = [];

        for (const ary of posAry) {
            if (ary[2] === "H") {
                for (let i = 0; i < ary[3]; i++) {
                    const id = ary[0] + i + (ary[1] * this.qrSize);
                    const rect = this.svgElm.getElementById(id);
                    rect.getAttribute("fill") === "grey" ? ids.push(id) : null;
                }
            } else {
                for (let i = 0; i < ary[3]; i++) {
                    const id = ary[0] + ((ary[1] + i) * this.qrSize);
                    const rect = this.svgElm.getElementById(id);
                    rect.getAttribute("fill") === "grey" ? ids.push(id) : null;
                }
            }
        }

        return ids;
    }

    

    addDarkModule(version) {
        const xPos = 8;
        const yPos = (4 * version) + 9;

        const id = xPos + (yPos * this.qrSize);

        this.svgElm.getElementById(id).setAttribute("fill", "black");
    }

    addTimingPatterns() {
        for (let i = 8; i < this.qrSize - 8; i++) {
            const id1 = i + (6 * this.qrSize);
            const id2 = 6 + (i * this.qrSize);

            const color = i % 2 === 0 ? "black" : "white";

            this.svgElm.getElementById(id1).setAttribute("fill", color);
            this.svgElm.getElementById(id2).setAttribute("fill", color);
        }
    }

    addAlignmentPatterns(version) {
        const alignPos = Alignment_Pattern_Locations_Table[version - 1];
        if (alignPos.length < 2) return;

        const allPos = this.getEveryAlignmentPos(alignPos);
        const notOverlappingPos = allPos.filter(pos => {
            const id = pos[0] + pos[1] * this.qrSize;
            const color = this.svgElm.getElementById(id).getAttribute("fill");
            return color === "grey";
        });

        const qrSize = this.qrSize;
        const pattern = [31, 17, 21, 17, 31].map(int => int.toString(2).split(""));

        notOverlappingPos.forEach(pos => {
            this.squarePatternMaker(pos[0] - 2, pos[1] - 2, pattern, qrSize);
        });
    }

    getEveryAlignmentPos(alignPos) {
        const posAry = [];
        for (const posX of alignPos) {
            for (const posY of alignPos) {
                posAry.push([posX, posY]);
            }
        }

        return posAry;
    }

    addSeperators(startX, startY, right, bottom, qrSize) {
        const stepX = right ? 1 : -1;
        const stepY = bottom ? 1 : -1;

        for (let i = 0; i < 8; i++) {
            const id1 = startX + (i * stepX) + (startY * qrSize);
            const id2 = (startX + (7 * stepX) + (startY * qrSize)) + (i * stepY * qrSize);

            const rect1 = this.svgElm.getElementById(id1);
            rect1.setAttribute("fill", "white");

            const rect2 = this.svgElm.getElementById(id2);
            rect2.setAttribute("fill", "white");

        }
    }

    addFinderPatternWithSeparator() {
        const qrSize = this.qrSize;
        const pattern = [127, 65, 93, 93, 93, 65, 127].map(int => int.toString(2).split(""));

        this.squarePatternMaker(0,0, pattern, qrSize);
        this.addSeperators(0, 7, true, false, qrSize);

        this.squarePatternMaker(qrSize - 7,0, pattern, qrSize);
        this.addSeperators(qrSize - 1, 7, false, false, qrSize);

        this.squarePatternMaker(0, qrSize - 7, pattern, qrSize);
        this.addSeperators(0, qrSize - 8, true, true, qrSize);
    }

    squarePatternMaker(startX, startY, pattern, qrSize, fillColor = true) {
        const idAry = [];
        for (let i = startY; i < startY + pattern.length; i++) {
            for (let j = startX; j < startX + pattern[i - startY].length; j++) {
                const id = i * qrSize + j;
                idAry.push(id);
                const rect = this.svgElm.getElementById(id);
                const color = pattern[i - startY][j - startX] === "1" ? "black" : "white";

                fillColor ? rect.setAttribute("fill", color) : null;
            }
        }

        return idAry;
    }

    initRectWithSize(x, y, width, height, id) {
        const rectElm = document.createElementNS(svgns, "rect");

        rectElm.setAttribute("id", id);

        rectElm.setAttribute("width", width);
        rectElm.setAttribute("height", height);

        rectElm.setAttribute("x", x);
        rectElm.setAttribute("y", y);
        
        rectElm.setAttribute("fill", "grey");

        return rectElm;
    }

    getRectDimentions(noOfRect) {
        const xPaddingPct = this.xyPadding * 2;
        const yPaddingPct = this.xyPadding * 2;
    
        const svgDimentions = this.getSvgDimentions();
    
        if (!svgDimentions) return;
    
        const contWidth = ( (100 - xPaddingPct) * svgDimentions[0] ) / 100;
        const contHeight = ( (100 - yPaddingPct) * svgDimentions[1] ) / 100;
    
        return [contWidth / noOfRect, contHeight / noOfRect];
    }

    getSvgDimentions() {
        const width = this.svgElm?.clientWidth;
        const height = this.svgElm?.clientHeight;
    
        if (width === undefined || height === undefined) return;
        return [width, height];
    }

    getRectStartPos() {
        const svgDimentions = this.getSvgDimentions();
    
        if (!svgDimentions) return;
    
        return [( this.xyPadding * svgDimentions[0] / 100),
                ( this.xyPadding * svgDimentions[1] ) / 100];
    }

}

customElements.define("dami-qrcode", DamiQrcode);
