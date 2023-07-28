/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/barcode/barcode.js":
/*!********************************!*\
  !*** ./src/barcode/barcode.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _encoding_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding-service */ "./src/barcode/encoding-service.js");


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
            const encodingValAndChksum = (0,_encoding_service__WEBPACK_IMPORTED_MODULE_0__.chooseEncodingType)(this.getAttribute("type"), this.getAttribute("value"));

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


/***/ }),

/***/ "./src/barcode/encoding-service.js":
/*!*****************************************!*\
  !*** ./src/barcode/encoding-service.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calcChecksumCode11: () => (/* binding */ calcChecksumCode11),
/* harmony export */   calcChecksumEanUpc: () => (/* binding */ calcChecksumEanUpc),
/* harmony export */   chooseEncodingType: () => (/* binding */ chooseEncodingType),
/* harmony export */   code11Encoder: () => (/* binding */ code11Encoder),
/* harmony export */   code39Encoder: () => (/* binding */ code39Encoder),
/* harmony export */   eanUpcEncoder: () => (/* binding */ eanUpcEncoder)
/* harmony export */ });
/* harmony import */ var _encoding_structure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding-structure */ "./src/barcode/encoding-structure.js");


function calcChecksumEanUpc(value) {
    let sum = 0;
    for (const [index, digit] of value.split("").reverse().entries()) {
      if (index % 2 <= 0) {
        sum += (Number(digit) * 3);    
      } else {
        sum += (Number(digit) * 1);   
      }
    }

    return (10 - (sum % 10)) > 9 ? "0" : (10 - (sum % 10)).toString();
}

function eanUpcEncoder(value, type) {
    let struct;
    if (type === "EAN13") {
      struct = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN13_STRUCTURE.get(value[0]);
      value = value.slice(1) + calcChecksumEanUpc(value);
    }

    if (type === "EAN8") {
      struct = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN8_STRUCTURE.get("0");
      value = value + calcChecksumEanUpc(value);
    }

    if (type === "UPCA") {
      struct = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.UPCA_STRUCTURE.get("0");
      value = value + calcChecksumEanUpc(value);
    }

    if (type === "UPCE") {
      let lastDigit = value[value.length - 1];
      let valAry = value.split("").reverse();
      let pattern = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.UPCE_PATTERN.get(lastDigit);
      if (!pattern) return;
      let upcaEquv = pattern.split("").map(chr => {
        if (chr === "X") return valAry.pop();
        return chr;
      }).join("");
      let checksum = calcChecksumEanUpc(upcaEquv);
      struct = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.UPCE_STRUCTURE.get(checksum);
      struct.lastGroup = "";
    }

    if (!struct) return;

    let encode = "";

    encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_MARKERS.startMarker;

    for (const [index, str] of (struct.firstGroup + struct.lastGroup).split("").entries()) {
      switch (str) {
        case "L":
          encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_ENCODING.get(value[index])?.lCode;
          break;
        case "G":
          encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_ENCODING.get(value[index])?.gCode;
          break;
        case "R":
          encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_ENCODING.get(value[index])?.rCode;
          break;
      }

      if (type !== "UPCE" && index === struct.firstGroup.length - 1) {
        encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_MARKERS.centerMarker;
      }
    }

    encode += (type === "UPCE" ? _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.UPCE_MARKERS.endMarker : _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.EAN_UPC_MARKERS.endMarker);

    return encode;

}

function calcChecksumCode11(value) {
    let sum = 0;
    const ck = ["", ""];
    const divideBy = [10, 9];

    let calcK = value.length > 10 ? 2 : 1;

    for (let i = 0; i < calcK; i++) {
      for (const [index, digit] of value.split("").reverse().entries()) {
        const mul = (index + 1) % divideBy[i] <= 0 ? divideBy[i] : (index + 1) % divideBy[i];
        const num = digit === "-" ? 10 : Number(digit);
  
        sum += (num * mul);
      }
      ck[i] = (sum % 11).toString();
  
      value += ck[i];
      sum = 0;
    }

    return ck.join("");
    
}

function code11Encoder(value) {
    value = value + calcChecksumEanUpc(value);

    let encode = "";

    encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE11_MARKERS.startMarker;
    encode += "0"; // Gap between codes

    for (const chr of value) {
      let code = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE11_ENCODING.get(chr);
      if (code) {
        encode += code;
        encode += "0";
      }
    }

    encode += _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE11_MARKERS.endMarker;

    return encode;
}

function code39Encoder(value) {
  const charList = value.split("");
  charList.push("*");
  charList.unshift("*");

  const encode = [];

  charList.forEach(chr => {
    const chrIndex = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_CHARACTERS.indexOf(chr);
    const otherChrIndex = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_OTHER_CHARACTERS.indexOf(chr);

    if (chrIndex < 0 && otherChrIndex >= 0) {
      encode.push( _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_OTHER_CHARACTERS_ENCODE.get(chr) );
      return;
    }

    const spacePos = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_SPACES[ Math.trunc( chrIndex / 10 ) ];
    const barsPos = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_BARS[ chrIndex % 10 ];

    const chrCode = [];

    for (let i = 1; i < 10; i++) {
      if (spacePos === i) chrCode.push(_encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_MARKERS.space);
      else if (barsPos.includes(i)) chrCode.push(_encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_MARKERS.bar);
      else chrCode.push(i % 2);
    }

    encode.push( chrCode.join("") );
  });

  return encode.join(_encoding_structure__WEBPACK_IMPORTED_MODULE_0__.CODE39_MARKERS.narrowSpace);
}


function chooseEncodingType(type, value) {
    switch(type?.toUpperCase()) {
      case "EAN13":
        if (value.length !== 12 || !( /^\d+$/.test(value) )) {
          console.error("Dami UI barcode: number of symbols needed is 12 and all digits.");
          break;
        }
        return [eanUpcEncoder(value, type.toUpperCase()), calcChecksumEanUpc(value)];

      case "EAN8":
        if (value.length !== 7 || !( /^\d+$/.test(value) )) {
          console.error("Dami UI barcode: number of symbols needed is 7 and all digits.");
          break;
        }
        return [eanUpcEncoder(value, type.toUpperCase()), calcChecksumEanUpc(value)];

      case "UPCA":
        if (value.length !== 11 || !( /^\d+$/.test(value) )) {
          console.error("Dami UI barcode: number of symbols needed is 11 and all digits.");
          break;
        }
        return [eanUpcEncoder(value, type.toUpperCase()), calcChecksumEanUpc(value)];

      case "UPCE":
        if (value.length !== 6 || !( /^\d+$/.test(value) )) {
          console.error("Dami UI barcode: number of symbols needed is 6 and all digits.");
          break;
        }
        return [eanUpcEncoder(value, type.toUpperCase()), calcChecksumEanUpc(value)];

      case "CODE11":
        if (!( /^(\d|-)+$/.test(value) )) {
          console.error("Dami UI barcode: should contain digit and/or hyphen(-).");
          break;
        }
        return [code11Encoder(value), calcChecksumCode11(value)];

      case "CODE39":
        if (!( /^[A-Z0-9 \-.\$\/\+\%]*$/.test(value) )) {
          console.error("Dami UI barcode: should contain digits, capital alphapetic character, '-', '.', '[space]', '$', '/', '+', '%'.");
          break;
        }
        return [code39Encoder(value), ""];

      default:
        console.error(`Dami UI barcode: Give proper barcode type for encoding.`);
        break;
    }
}


/***/ }),

/***/ "./src/barcode/encoding-structure.js":
/*!*******************************************!*\
  !*** ./src/barcode/encoding-structure.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CODE11_ENCODING: () => (/* binding */ CODE11_ENCODING),
/* harmony export */   CODE11_MARKERS: () => (/* binding */ CODE11_MARKERS),
/* harmony export */   CODE39_BARS: () => (/* binding */ CODE39_BARS),
/* harmony export */   CODE39_CHARACTERS: () => (/* binding */ CODE39_CHARACTERS),
/* harmony export */   CODE39_MARKERS: () => (/* binding */ CODE39_MARKERS),
/* harmony export */   CODE39_OTHER_CHARACTERS: () => (/* binding */ CODE39_OTHER_CHARACTERS),
/* harmony export */   CODE39_OTHER_CHARACTERS_ENCODE: () => (/* binding */ CODE39_OTHER_CHARACTERS_ENCODE),
/* harmony export */   CODE39_SPACES: () => (/* binding */ CODE39_SPACES),
/* harmony export */   EAN13_STRUCTURE: () => (/* binding */ EAN13_STRUCTURE),
/* harmony export */   EAN8_STRUCTURE: () => (/* binding */ EAN8_STRUCTURE),
/* harmony export */   EAN_UPC_ENCODING: () => (/* binding */ EAN_UPC_ENCODING),
/* harmony export */   EAN_UPC_MARKERS: () => (/* binding */ EAN_UPC_MARKERS),
/* harmony export */   UPCA_STRUCTURE: () => (/* binding */ UPCA_STRUCTURE),
/* harmony export */   UPCE_MARKERS: () => (/* binding */ UPCE_MARKERS),
/* harmony export */   UPCE_PATTERN: () => (/* binding */ UPCE_PATTERN),
/* harmony export */   UPCE_STRUCTURE: () => (/* binding */ UPCE_STRUCTURE)
/* harmony export */ });
const EAN13_STRUCTURE = new Map([
    ["0", {firstGroup: "LLLLLL", lastGroup: "RRRRRR"}],
    ["1", {firstGroup: "LLGLGG", lastGroup: "RRRRRR"}],
    ["2", {firstGroup: "LLGGLG", lastGroup: "RRRRRR"}],
    ["3", {firstGroup: "LLGGGL", lastGroup: "RRRRRR"}],
    ["4", {firstGroup: "LGLLGG", lastGroup: "RRRRRR"}],
    ["5", {firstGroup: "LGGLLG", lastGroup: "RRRRRR"}],
    ["6", {firstGroup: "LGGGLL", lastGroup: "RRRRRR"}],
    ["7", {firstGroup: "LGLGLG", lastGroup: "RRRRRR"}],
    ["8", {firstGroup: "LGLGGL", lastGroup: "RRRRRR"}],
    ["9", {firstGroup: "LGGLGL", lastGroup: "RRRRRR"}],
]);

const EAN_UPC_ENCODING = new Map([
    ["0", {lCode: "0001101", gCode: "", rCode: ""}],
    ["1", {lCode: "0011001", gCode: "", rCode: ""}],
    ["2", {lCode: "0010011", gCode: "", rCode: ""}],
    ["3", {lCode: "0111101", gCode: "", rCode: ""}],
    ["4", {lCode: "0100011", gCode: "", rCode: ""}],
    ["5", {lCode: "0110001", gCode: "", rCode: ""}],
    ["6", {lCode: "0101111", gCode: "", rCode: ""}],
    ["7", {lCode: "0111011", gCode: "", rCode: ""}],
    ["8", {lCode: "0110111", gCode: "", rCode: ""}],
    ["9", {lCode: "0001011", gCode: "", rCode: ""}],
]);

const EAN_UPC_MARKERS = {
    startMarker: "101",
    centerMarker: "01010",
    endMarker: "101",
};

for (const obj of EAN_UPC_ENCODING.values()) {
    obj.rCode = obj.lCode.
                    trim().
                    split("").
                    map(chr => chr === "0" ? "1" : "0").
                    join("");

    obj.gCode = obj.rCode.
                trim().split("").reverse().join("");
}




const EAN8_STRUCTURE = new Map([
    ["0", {firstGroup: "LLLL", lastGroup: "RRRR"}],
]);

const UPCA_STRUCTURE = new Map([
    ["0", {firstGroup: "LLLLLL", lastGroup: "RRRRRR"}],
]);



const UPCE_STRUCTURE = new Map([
    ["0", {firstGroup: "GGGLLL"}],
    ["1", {firstGroup: "GGLGLL"}],
    ["2", {firstGroup: "GGLLGL"}],
    ["3", {firstGroup: "GGLLLG"}],
    ["4", {firstGroup: "GLGGLL"}],
    ["5", {firstGroup: "GLLGGL"}],
    ["6", {firstGroup: "GLLLGG"}],
    ["7", {firstGroup: "GLGLGL"}],
    ["8", {firstGroup: "GLGLLG"}],
    ["9", {firstGroup: "GLLGLG"}],
]);

const UPCE_PATTERN = new Map([
    ["0", "0XX00000XXX"],
    ["1", "0XX10000XXX"],
    ["2", "0XX20000XXX"],
    ["3", "0XXX00000XX"],
    ["4", "0XXXX00000X"],
    ["5", "0XXXXX00005"],
    ["6", "0XXXXX00006"],
    ["7", "0XXXXX00007"],
    ["8", "0XXXXX00008"],
    ["9", "0XXXXX00009"],
]);

const UPCE_MARKERS = {
    endMarker: "010101",
};


const CODE11_ENCODING = new Map([
    ["0",  "101011"],
    ["1",  "1101011"],
    ["2",  "1001011"],
    ["3",  "1100101"],
    ["4",  "1011011"],
    ["5",  "1101101"],
    ["6",  "1001101"],
    ["7",  "1010011"],
    ["8",  "1101001"],
    ["9",  "110101"],
    ["-",  "101101"],
]);

const CODE11_MARKERS = {
    startMarker: "1011001",
    endMarker: "1011001",
};

const CODE39_CHARACTERS = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *";

const CODE39_OTHER_CHARACTERS = "$/+%";

const CODE39_OTHER_CHARACTERS_ENCODE = new Map([
    ["$", "100100100101"],
    ["/", "100100101001"],
    ["+", "100101001001"],
    ["%", "101001001001"],
]);

const CODE39_BARS = [
    [1, 9],
    [3, 9],
    [1, 3],
    [5, 9],
    [1, 5],
    [3, 5],
    [7, 9],
    [1, 7],
    [3, 7],
    [5, 7],
]

const CODE39_SPACES = [
    4,
    6,
    8,
    2,
]

const CODE39_MARKERS = {
    bar: "11",
    space: "00",
    narrowSpace: "0",
};



/***/ }),

/***/ "./src/qrcode/encoding-service.js":
/*!****************************************!*\
  !*** ./src/qrcode/encoding-service.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFinalQrAry: () => (/* binding */ getFinalQrAry),
/* harmony export */   qrEncodedData: () => (/* binding */ qrEncodedData)
/* harmony export */ });
/* harmony import */ var _encoding_structure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding-structure */ "./src/qrcode/encoding-structure.js");


function getQrMode(value) {
    if (typeof value !== "string" || value === "") {
        console.error("Dami-UI Qrcode: The value must be a non-empty string.");
        return;
    } else if (!(/\D/.test(value))) {
        return "numeric";
    } else if (/^[A-Z0-9 -\.\$\/\+\%\:\*]*$/.test(value)) {
        return "alphanumeric";
    } else {
        return "byte";
    }
}

function getCodeCapacityAndVersion(value, modeType, correctionLevel) {
    const charLength = utf8Length(value);

    const capacity = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Character_Capacity_Table[modeType][correctionLevel].find(val => val >= charLength);
    const version = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Character_Capacity_Table[modeType][correctionLevel].indexOf(capacity) + 1;

    return {capacity, version};
}

function characterCountSize(version, modeType) {
    if (version <= 9) {
        return _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Character_Count_Indicator[0][modeType];
    } else if (version <= 26) {
        return _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Character_Count_Indicator[1][modeType];
    } else {
        return _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Character_Count_Indicator[2][modeType];
    }
}

function getCharacterCountIndicator(value, version, modeType) {
    const charLength = utf8Length(value);
    const charCountLength = characterCountSize(version, modeType);

    const charLenInBinary = charLength.toString(2).split("");

    while (charLenInBinary.length < charCountLength) {
        charLenInBinary.unshift("0");
    }

    return charLenInBinary.join("");
}

function qrEncodedData(value, correctionLevel) {
    const modeType = getQrMode(value);

    if (!modeType) return;

    const {capacity, version} = getCodeCapacityAndVersion(value, modeType, correctionLevel);

    if (!capacity || !version) return;

    const modeIndicator = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Mode_Indicator.get(modeType);

    const characterCountIndicator = getCharacterCountIndicator(value, version, modeType);

    const encodedData = encodeData(value, modeType);

    if (!modeIndicator || !characterCountIndicator || !encodedData) return;

    const dataAry = [modeIndicator, characterCountIndicator, encodedData];

    const dataCapacity = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Error_Correction_Code_Table[correctionLevel][version - 1].dataCapacity;
    const errorPerBlock = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Error_Correction_Code_Table[correctionLevel][version - 1].errorPerBlock;
    const group1 = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Error_Correction_Code_Table[correctionLevel][version - 1].group1;
    const group2 = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Error_Correction_Code_Table[correctionLevel][version - 1].group2;

    if (!dataCapacity || !errorPerBlock) return;

    const encodedAry = encodedDataWithPaddings(dataAry, dataCapacity);

    const codeBlocks = getAllCodeBlocks(encodedAry, group1, group2);
    const errorBlocks = getAllErrorCorectionCode(errorPerBlock, codeBlocks);

    const encodedDataWithErrorCorrection = interleaveDataBlocks(codeBlocks) + interleaveDataBlocks(errorBlocks);
    const remainderBits = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Remainder_Bits[version - 1];

    const finalEncodedData = encodedDataWithErrorCorrection.padEnd(encodedDataWithErrorCorrection.length + remainderBits, "0");

    return {data: finalEncodedData, version: version};
}

function encodedDataWithPaddings(dataAry, capacity) {
    let dataBits = dataAry.flat().join("");
    const capacityBitLen = capacity * 8;
    const encodedAry = [];

    if (capacityBitLen - dataBits.length >= 4) dataBits = dataBits.padEnd(dataBits.length + 4, "0");
    else dataBits = dataBits.padEnd(capacityBitLen, "0");
    
    if (dataBits.length % 8 > 0) dataBits = dataBits.padEnd((Math.trunc(dataBits.length / 8) + 1) * 8, "0");

    let i = 0;
    while ((capacityBitLen / 8) > (dataBits.length / 8)) {
        const padBytes = ["11101100", "00010001"];
        dataBits = dataBits + padBytes[i % 2];
        i++;
    }

    for (let start = 0; start < (dataBits.length / 8); start++) {
        encodedAry.push( dataBits.slice(start * 8, (start + 1) * 8) );
    }

    return encodedAry;
}

function encodeData(value, modeType) {
    if (modeType === "numeric") {
        return encodeNumericData(value);
    } else if (modeType === "alphanumeric") {
        return encodeAlphanumericData(value);
    } else if (modeType === "byte") {
        return encodeByteData(value);
    } else {
        return;
    }
}

function encodeNumericData(value) {
    const numChunk = [];
    const valAry = value.split("");
    const binaryAry = []

    while (valAry.length > 3) {
        numChunk.push( Number(valAry.splice(0, 3).join("")) );
    }
    numChunk.push( Number(valAry.join("")) );

    numChunk.forEach(num => {
        const numLen = digitLength(num);
        let binaryForm = num.toString(2);

        if (numLen === 3) {
            binaryAry.push( binaryForm.padStart(10, "0") );
        }
        if (numLen === 2) {
            binaryAry.push( binaryForm.padStart(7, "0") );
        }
        if (numLen === 1) {
            binaryAry.push( binaryForm.padStart(4, "0") );
        }
    });

    return binaryAry;
}

function digitLength(num) {
    let count = 1;
    while ( Math.trunc(num / 10) > 0 ) {
        num = Math.trunc(num / 10);
        count++
    }

    return count;
}

function utf8Length(value) {
    const utf8Str = encodeURIComponent(value);
    const hexNum = utf8Str.split("").filter(chr => chr === "%").length;
    return utf8Str.length - (2 * hexNum);
}

function encodeAlphanumericData(value) {
    const letterChunk = [];
    const valAry = value.split("");
    const binaryAry = []

    while (valAry.length > 2) {
        letterChunk.push( valAry.splice(0, 2).join("") );
    }
    letterChunk.push( valAry.join("") );

    letterChunk.forEach(str => {
        let binaryForm;
        if (str.length === 2) {
            const num = (45 * _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Alphanumeric_Code.get(str[0])) + _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Alphanumeric_Code.get(str[1]);
            binaryForm = num.toString(2);
        } else {
            const num = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Alphanumeric_Code.get(str[0]);
            binaryForm = num.toString(2);
        }

        if (str.length === 2) {
            binaryAry.push( binaryForm.padStart(11, "0") );
        }
        if (str.length === 1) {
            binaryAry.push( binaryForm.padStart(6, "0") );
        }
    });

    return binaryAry;
}

function encodeByteData(value) {
    const utf8Str = encodeURIComponent(value);
    const binaryAry = [];

    let hex = 0;
    for (let i = 0; i < utf8Str.length; i++) {
        if (utf8Str[i] === "%") {
            let binaryVal = parseInt(utf8Str[i+1] + utf8Str[i+2], 16).toString(2).padStart(8, '0');
            binaryAry.push(binaryVal);
            hex = 2;
            continue;
        }
        if (hex > 0) {
            hex--;
            continue;
        }

        binaryAry.push( utf8Str[i].charCodeAt(0).toString(2).padStart(8, "0") );
    }

    return binaryAry;
}


// Error Correct Code

function interleaveDataBlocks(dataBlocks) {
    const interleavedData = [];
    const maxLen = Math.max(...dataBlocks.map(block => block.length));

    for (let i = 0; i < maxLen; i++) {
        for (const block of dataBlocks) {
            const bin = block[i];
            if (bin !== undefined && bin !== null) interleavedData.push(bin);
        }
    }

    return interleavedData.join("");
}

function getAllCodeBlocks(encodedData, group1, group2) {
    let start = 0;
    let codeBlocks = [];

    for (let i = 0; i < group1[0]; i++) {
        const block = encodedData.slice(start, start + group1[1]);
        codeBlocks.push(block);
        start += group1[1];
    }

    for (let i = 0; i < group2[0]; i++) {
        const block = encodedData.slice(start, start + group2[1]);
        codeBlocks.push(block);
        start += group2[1];
    }

    return codeBlocks
}

function getAllErrorCorectionCode(errorCodeware, codeBlocks) {
    const errorBlocks = [];

    for (const code of codeBlocks) {
        errorBlocks.push( errorCorrectioCodeGen(errorCodeware, code) );
    }

    return errorBlocks;
}

function errorCorrectioCodeGen(errorCodeware, encodedData) {
    const messagePoly = encodedData.map((bin, i) => [parseInt(bin, 2), encodedData.length - 1 - i + errorCodeware]);
    let generatorPoly = GeneratorPolynomial(errorCodeware);

    const xAddTerm = messagePoly[0][1] - generatorPoly[0][1];
    generatorPoly = generatorPoly.map(ary => [ary[0], ary[1] + xAddTerm]);

    const remainder = polyDivisionRecur(messagePoly.map(ary => ary[0]), generatorPoly.map(ary => ary[0]), messagePoly.length);
    
    return remainder.map(int => int.toString(2).padStart(8, "0"));
}

function polyDivisionRecur(message, generator, steps) {
    if (steps <= 0) return message;

    const mulExp = findExp(message[0]);

    const newGenerator = generator.map(exp => findInt(exp + mulExp > 255 ? (exp + mulExp) % 255 : (exp + mulExp)));
    
    message = message.length > newGenerator.length ? message.map((msg, ind) => msg ^ (newGenerator[ind] ?? 0)) : newGenerator.map((msg, ind) => msg ^ (message[ind] ?? 0));

    let i = 0;
    while (message[0] === 0) {message.shift();i++;}

    return polyDivisionRecur(message, generator, steps - i);
}

function GeneratorPolynomial(codeware, n1 = [[0,1],[0,0]], n2 = [[0,1],[1,0]]) {
    if (n2[1][0] >= codeware) return n1;

    const result = [];
    let newN1 = [];
    for (let n1i of n1) {
        for (let n2i of n2) {
            const a = (n1i[0] + n2i[0]) > 255 ? (n1i[0] + n2i[0]) % 255 : (n1i[0] + n2i[0]);
            const x = n1i[1] + n2i[1];
            newN1.push([a, x]);
        }
    }

    while (newN1.length > 0) {
        const likeTerms = newN1.filter(trm => trm[1] === newN1[0][1]);
        const unlikeTerms = newN1.filter(trm => trm[1] !== newN1[0][1]);
        let addXor = likeTerms.map(trm => trm[0]).reduce((acc, val) => acc ^ findInt(val), 0);
        addXor === 0 ? null : result.push([findExp(addXor), newN1[0][1]]);
        newN1 = unlikeTerms;
    }

    n2[1][0] = n2[1][0] + 1;
    return GeneratorPolynomial(codeware, result, n2);
}

function findInt(exp) {
    return _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Galois_Field_Table.find(val => val.exp === exp).int;
}

function findExp(int) {
    return _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Galois_Field_Table.find(val => val.int === int).exp;
}

function getFinalQrAry(qrAry, qrSize, dataIds, correctionLevel, version) {
    const qrArysWithFormatAndVersionInfo = getQrArysWithFormatAndVersionInfo([...qrAry], qrSize, correctionLevel, version);
    const maskedQrArys = getMaskedQrArys(qrArysWithFormatAndVersionInfo, dataIds, qrSize);
    const qrAryWithMinPenalty = getQrAryWithMinPenalty(maskedQrArys, qrSize);

    return qrAryWithMinPenalty;
}

function getQrArysWithFormatAndVersionInfo(qrAry, qrSize, correctionLevel, version) {
    const qrArysWithInfo = [];
    getQrArysWithFormatInfo(qrAry, qrSize, correctionLevel, qrArysWithInfo);
    getQrArysWithVersionInfo(qrSize, version, qrArysWithInfo);

    return qrArysWithInfo;
}

function getQrArysWithFormatInfo(qrAry, qrSize, correctionLevel, qrArysWithInfo) {
    const formatBitsAry = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Format_Information_Table[correctionLevel];

    const versionId0 = [0 + qrSize * 8, 1 + qrSize * 8, 2 + qrSize * 8, 3 + qrSize * 8, 4 + qrSize * 8, 5 + qrSize * 8, 7 + qrSize * 8, 8 + qrSize * 8, 8 + qrSize * 7, 8 + qrSize * 5, 8 + qrSize * 4, 8 + qrSize * 3, 8 + qrSize * 2, 8 + qrSize * 1, 8 + qrSize * 0,]
    const versionId1 = [null, null, null, null, null, null, null, qrSize - 8 + qrSize * 8, qrSize - 7 + qrSize * 8, qrSize - 6 + qrSize * 8, qrSize - 5 + qrSize * 8, qrSize - 4 + qrSize * 8, qrSize - 3 + qrSize * 8, qrSize - 2 + qrSize * 8, qrSize - 1 + qrSize * 8,]
    const versionId2 = [8 + qrSize * (qrSize - 1), 8 + qrSize * (qrSize - 2), 8 + qrSize * (qrSize - 3), 8 + qrSize * (qrSize - 4), 8 + qrSize * (qrSize - 5), 8 + qrSize * (qrSize - 6), 8 + qrSize * (qrSize - 7), null, null, null, null, null, null, null, null,]

    for (const formatBits of formatBitsAry) {
        const qrAryClone = [...qrAry];

        versionId0.forEach((val, ind) => {
            const id = val;
            if (id !== null) {
                qrAryClone[id] = Number(formatBits[ind]);
            }
        });
        versionId1.forEach((val, ind) => {
            const id = val;
            if (id !== null) {
                qrAryClone[id] = Number(formatBits[ind]);
            }
        });
        versionId2.forEach((val, ind) => {
            const id = val;
            if (id !== null) {
                qrAryClone[id] = Number(formatBits[ind]);
            }
        });

        qrArysWithInfo.push(qrAryClone);
    }
}

function getQrArysWithVersionInfo(qrSize, version, qrArysWithInfo) {
    if (version < 7) return;
    const versionBits = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Version_Information_Table[version - 7].split("").reverse();
    const bitPlacmentPos1 = [];
    const bitPlacmentPos2 = [];

    for (let i = 0; i < 6; i++) {
        bitPlacmentPos1.push( i + qrSize * (qrSize - 11), i + qrSize * (qrSize - 10), i + qrSize * (qrSize - 9) );
    }

    for (let i = 0; i < 6; i++) {
        bitPlacmentPos2.push( qrSize - 11 + qrSize * i, qrSize - 10 + qrSize * i, qrSize - 9 + qrSize * i );
    }

    for (const qrAry of qrArysWithInfo) {

        bitPlacmentPos1.forEach((val, ind) => {
            const id = val;
            if (id !== null) {
                qrAry[id] = Number(versionBits[ind]);
            }
        });
        bitPlacmentPos2.forEach((val, ind) => {
            const id = val;
            if (id !== null) {
                qrAry[id] = Number(versionBits[ind]);
            }
        });
    }

}

function getMaskedQrArys(qrArys, dataIds, qrSize) {
    let mask = 0;
    for (const qrAry of qrArys) {
        for (const id of dataIds) {
            const row = id % qrSize;
            const column = Math.trunc(id / qrSize);

            if (mask === 0 && (row + column) % 2 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 1 && (column) % 2 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 2 && (row) % 3 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 3 && (row + column) % 3 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 4 && ( Math.floor(column / 2) + Math.floor(row / 3) ) % 2 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 5 && ((row * column) % 2) + ((row * column) % 3) === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 6 && ( ((row * column) % 2) + ((row * column) % 3) ) % 2 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
            if (mask === 7 && ( ((row + column) % 2) + ((row * column) % 3) ) % 2 === 0) {
                qrAry[id] = 1 ^ qrAry[id];
            }
        }
        mask++;
    }

    return qrArys;
}

function getQrAryWithMinPenalty(maskedQrArys, qrSize) {
    const penaltyAry = [];
    
    for (const qrAry of maskedQrArys) {
        let penalty = 0;
        const rows = [];
        const cols = [];

        // Penalty 1
        for (let i = 0; i < qrSize; i++) {
            const rowAry = qrAry.slice(qrSize * i, qrSize * (i + 1));
            rows.push(rowAry);
            penalty += calcPenalty1(rowAry);
        }

        for (let i = 0; i < qrSize; i++) {
            const colAry = rows.map(rw => rw[i]);
            cols.push(colAry);
            penalty += calcPenalty1(colAry);
        }

        //Penalty 2
        for (let i = 0; i < qrSize - 1; i++) {
            for (let j = 0; j < qrSize - 1; j++) {
                let sum = rows[i][j] + rows[i][j + 1] + rows[i + 1][j] + rows[i + 1][j + 1];
                if (sum === 0 || sum === 4) penalty += 3; 
            }
        }

        //Penalty 3
        const penalty3Patter = ["10111010000", "00001011101"];
        for (let i = 0; i < qrSize; i++) {
            for (let j = 0; j < qrSize - penalty3Patter[0].length; j++) {
                const str = rows[i].slice(j, j + penalty3Patter[0].length).join("");
                if (str === penalty3Patter[0] || str === penalty3Patter[1]) penalty += 40;
            }
        }

        for (let i = 0; i < qrSize; i++) {
            for (let j = 0; j < qrSize - penalty3Patter[0].length; j++) {
                const str = cols[i].slice(j, j + penalty3Patter[0].length).join("");
                if (str === penalty3Patter[0] || str === penalty3Patter[1]) penalty += 40;
            }
        }

        // Penalty 4
        const modulesLen = qrAry.length;
        const darkModulesLen = qrAry.filter(bt => bt === 1).length;
        const darkPerc = (darkModulesLen / modulesLen) * 100;
        const roundedPercentage = darkPerc > 50
                                    ? Math.floor(darkPerc / 5) * 5
                                    : Math.ceil(darkPerc / 5) * 5;
        const mixPenalty = Math.abs(roundedPercentage - 50) * 2;
        penalty += mixPenalty;

        penaltyAry.push(penalty);
    }

    const smallestVal = Math.min(...penaltyAry);
    const ind = penaltyAry.indexOf(smallestVal);

    return maskedQrArys[ind];
}

function calcPenalty1(rowAry) {
    let penalty = 0;
    let cnt = 0;
    let bit = rowAry[0];
    for (const bitVal of rowAry) {
        if (bit === bitVal) cnt++;
        else {
            if (cnt >= 5) penalty += (cnt - 2);
            cnt = 1;
            bit = bitVal;
        }
    }

    if (cnt >= 5) penalty += (cnt - 2);

    return penalty;
}

/***/ }),

/***/ "./src/qrcode/encoding-structure.js":
/*!******************************************!*\
  !*** ./src/qrcode/encoding-structure.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alignment_Pattern_Locations_Table: () => (/* binding */ Alignment_Pattern_Locations_Table),
/* harmony export */   Alphanumeric_Code: () => (/* binding */ Alphanumeric_Code),
/* harmony export */   Character_Capacity_Table: () => (/* binding */ Character_Capacity_Table),
/* harmony export */   Character_Count_Indicator: () => (/* binding */ Character_Count_Indicator),
/* harmony export */   Error_Correction_Code_Table: () => (/* binding */ Error_Correction_Code_Table),
/* harmony export */   Error_Correction_Level: () => (/* binding */ Error_Correction_Level),
/* harmony export */   Format_Information_Table: () => (/* binding */ Format_Information_Table),
/* harmony export */   Galois_Field_Table: () => (/* binding */ Galois_Field_Table),
/* harmony export */   Mode_Indicator: () => (/* binding */ Mode_Indicator),
/* harmony export */   Remainder_Bits: () => (/* binding */ Remainder_Bits),
/* harmony export */   Version_Information_Table: () => (/* binding */ Version_Information_Table)
/* harmony export */ });
const Error_Correction_Level = new Map([
    ["L", 7],
    ["M", 15],
    ["Q", 25],
    ["H", 30],
]);

const Mode_Indicator = new Map([
    ["numeric", "0001"],
    ["alphanumeric", "0010"],
    ["byte", "0100"],
]);

const Character_Capacity_Table = {
    numeric: {
        L: [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479, 6743, 7089],
        M: [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596],
        Q: [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993],
        H: [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524, 2625, 2735, 2927, 3057],
    },
    alphanumeric: {
        L: [25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758, 854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132, 2223, 2369, 2520, 2677, 2840, 3009, 3183, 3351, 3537, 3729, 3927, 4087, 4296],
        M: [20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600, 656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391],
        Q: [16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470, 531, 574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322, 1429, 1499, 1618, 1700, 1787, 1867, 1966, 2071, 2181, 2298, 2420],
        H: [10, 20, 35, 50, 64, 84, 93, 122, 143, 174, 200, 227, 259, 283, 321, 365, 408, 452, 493, 557, 587, 640, 672, 744, 779, 864, 910, 958, 1016, 1080, 1150, 1226, 1307, 1394, 1431, 1530, 1591, 1658, 1774, 1852],
    },
    byte: {
        L: [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953],
        M: [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331],
        Q: [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663],
        H: [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273],
    },
};

const Character_Count_Indicator = [
    {numeric: 10, alphanumeric: 9, byte: 8},
    {numeric: 12, alphanumeric: 11, byte: 16},
    {numeric: 14, alphanumeric: 13, byte: 16},
]

const Alphanumeric_Code = new Map([
    [" ", 36],
    ["$", 37],
    ["%", 38],
    ["*", 39],
    ["+", 40],
    ["-", 41],
    [".", 42],
    ["/", 43],
    [":", 44],
]);
for (let i = 0; i < 10; i++) {
    Alphanumeric_Code.set(i.toString(), i);
}
for (let i = 65; i <= 90; i++) {
    Alphanumeric_Code.set(String.fromCharCode(i), i - 55);
}

const Error_Correction_Code_Table = {
    L: [{dataCapacity:19,errorPerBlock:7,group1:[1,19],group2:[0,0]},{dataCapacity:34,errorPerBlock:10,group1:[1,34],group2:[0,0]},{dataCapacity:55,errorPerBlock:15,group1:[1,55],group2:[0,0]},{dataCapacity:80,errorPerBlock:20,group1:[1,80],group2:[0,0]},{dataCapacity:108,errorPerBlock:26,group1:[1,108],group2:[0,0]},{dataCapacity:136,errorPerBlock:18,group1:[2,68],group2:[0,0]},{dataCapacity:156,errorPerBlock:20,group1:[2,78],group2:[0,0]},{dataCapacity:194,errorPerBlock:24,group1:[2,97],group2:[0,0]},{dataCapacity:232,errorPerBlock:30,group1:[2,116],group2:[0,0]},{dataCapacity:274,errorPerBlock:18,group1:[2,68],group2:[2,69]},{dataCapacity:324,errorPerBlock:20,group1:[4,81],group2:[0,0]},{dataCapacity:370,errorPerBlock:24,group1:[2,92],group2:[2,93]},{dataCapacity:428,errorPerBlock:26,group1:[4,107],group2:[0,0]},{dataCapacity:461,errorPerBlock:30,group1:[3,115],group2:[1,116]},{dataCapacity:523,errorPerBlock:22,group1:[5,87],group2:[1,88]},{dataCapacity:589,errorPerBlock:24,group1:[5,98],group2:[1,99]},{dataCapacity:647,errorPerBlock:28,group1:[1,107],group2:[5,108]},{dataCapacity:721,errorPerBlock:30,group1:[5,120],group2:[1,121]},{dataCapacity:795,errorPerBlock:28,group1:[3,113],group2:[4,114]},{dataCapacity:861,errorPerBlock:28,group1:[3,107],group2:[5,108]},{dataCapacity:932,errorPerBlock:28,group1:[4,116],group2:[4,117]},{dataCapacity:1006,errorPerBlock:28,group1:[2,111],group2:[7,112]},{dataCapacity:1094,errorPerBlock:30,group1:[4,121],group2:[5,122]},{dataCapacity:1174,errorPerBlock:30,group1:[6,117],group2:[4,118]},{dataCapacity:1276,errorPerBlock:26,group1:[8,106],group2:[4,107]},{dataCapacity:1370,errorPerBlock:28,group1:[10,114],group2:[2,115]},{dataCapacity:1468,errorPerBlock:30,group1:[8,122],group2:[4,123]},{dataCapacity:1531,errorPerBlock:30,group1:[3,117],group2:[10,118]},{dataCapacity:1631,errorPerBlock:30,group1:[7,116],group2:[7,117]},{dataCapacity:1735,errorPerBlock:30,group1:[5,115],group2:[10,116]},{dataCapacity:1843,errorPerBlock:30,group1:[13,115],group2:[3,116]},{dataCapacity:1955,errorPerBlock:30,group1:[17,115],group2:[0,0]},{dataCapacity:2071,errorPerBlock:30,group1:[17,115],group2:[1,116]},{dataCapacity:2191,errorPerBlock:30,group1:[13,115],group2:[6,116]},{dataCapacity:2306,errorPerBlock:30,group1:[12,121],group2:[7,122]},{dataCapacity:2434,errorPerBlock:30,group1:[6,121],group2:[14,122]},{dataCapacity:2566,errorPerBlock:30,group1:[17,122],group2:[4,123]},{dataCapacity:2702,errorPerBlock:30,group1:[4,122],group2:[18,123]},{dataCapacity:2812,errorPerBlock:30,group1:[20,117],group2:[4,118]},{dataCapacity:2956,errorPerBlock:30,group1:[19,118],group2:[6,119]}],
    M: [{dataCapacity:16,errorPerBlock:10,group1:[1,16],group2:[0,0]},{dataCapacity:28,errorPerBlock:16,group1:[1,28],group2:[0,0]},{dataCapacity:44,errorPerBlock:26,group1:[1,44],group2:[0,0]},{dataCapacity:64,errorPerBlock:18,group1:[2,32],group2:[0,0]},{dataCapacity:86,errorPerBlock:24,group1:[2,43],group2:[0,0]},{dataCapacity:108,errorPerBlock:16,group1:[4,27],group2:[0,0]},{dataCapacity:124,errorPerBlock:18,group1:[4,31],group2:[0,0]},{dataCapacity:154,errorPerBlock:22,group1:[2,38],group2:[2,39]},{dataCapacity:182,errorPerBlock:22,group1:[3,36],group2:[2,37]},{dataCapacity:216,errorPerBlock:26,group1:[4,43],group2:[1,44]},{dataCapacity:254,errorPerBlock:30,group1:[1,50],group2:[4,51]},{dataCapacity:290,errorPerBlock:22,group1:[6,36],group2:[2,37]},{dataCapacity:334,errorPerBlock:22,group1:[8,37],group2:[1,38]},{dataCapacity:365,errorPerBlock:24,group1:[4,40],group2:[5,41]},{dataCapacity:415,errorPerBlock:24,group1:[5,41],group2:[5,42]},{dataCapacity:453,errorPerBlock:28,group1:[7,45],group2:[3,46]},{dataCapacity:507,errorPerBlock:28,group1:[10,46],group2:[1,47]},{dataCapacity:563,errorPerBlock:26,group1:[9,43],group2:[4,44]},{dataCapacity:627,errorPerBlock:26,group1:[3,44],group2:[11,45]},{dataCapacity:669,errorPerBlock:26,group1:[3,41],group2:[13,42]},{dataCapacity:714,errorPerBlock:26,group1:[17,42],group2:[0,0]},{dataCapacity:782,errorPerBlock:28,group1:[17,46],group2:[0,0]},{dataCapacity:860,errorPerBlock:28,group1:[4,47],group2:[14,48]},{dataCapacity:914,errorPerBlock:28,group1:[6,45],group2:[14,46]},{dataCapacity:1000,errorPerBlock:28,group1:[8,47],group2:[13,48]},{dataCapacity:1062,errorPerBlock:28,group1:[19,46],group2:[4,47]},{dataCapacity:1128,errorPerBlock:28,group1:[22,45],group2:[3,46]},{dataCapacity:1193,errorPerBlock:28,group1:[3,45],group2:[23,46]},{dataCapacity:1267,errorPerBlock:28,group1:[21,45],group2:[7,46]},{dataCapacity:1373,errorPerBlock:28,group1:[19,47],group2:[10,48]},{dataCapacity:1455,errorPerBlock:28,group1:[2,46],group2:[29,47]},{dataCapacity:1541,errorPerBlock:28,group1:[10,46],group2:[23,47]},{dataCapacity:1631,errorPerBlock:28,group1:[14,46],group2:[21,47]},{dataCapacity:1725,errorPerBlock:28,group1:[14,46],group2:[23,47]},{dataCapacity:1812,errorPerBlock:28,group1:[12,47],group2:[26,48]},{dataCapacity:1914,errorPerBlock:28,group1:[6,47],group2:[34,48]},{dataCapacity:1992,errorPerBlock:28,group1:[29,46],group2:[14,47]},{dataCapacity:2102,errorPerBlock:28,group1:[13,46],group2:[32,47]},{dataCapacity:2216,errorPerBlock:28,group1:[40,47],group2:[7,48]},{dataCapacity:2334,errorPerBlock:28,group1:[18,47],group2:[31,48]}],
    Q: [{dataCapacity:13,errorPerBlock:13,group1:[1,13],group2:[0,0]},{dataCapacity:22,errorPerBlock:22,group1:[1,22],group2:[0,0]},{dataCapacity:34,errorPerBlock:18,group1:[2,17],group2:[0,0]},{dataCapacity:48,errorPerBlock:26,group1:[2,24],group2:[0,0]},{dataCapacity:62,errorPerBlock:18,group1:[2,15],group2:[2,16]},{dataCapacity:76,errorPerBlock:24,group1:[4,19],group2:[0,0]},{dataCapacity:88,errorPerBlock:18,group1:[2,14],group2:[4,15]},{dataCapacity:110,errorPerBlock:22,group1:[4,18],group2:[2,19]},{dataCapacity:132,errorPerBlock:20,group1:[4,16],group2:[4,17]},{dataCapacity:154,errorPerBlock:24,group1:[6,19],group2:[2,20]},{dataCapacity:180,errorPerBlock:28,group1:[4,22],group2:[4,23]},{dataCapacity:206,errorPerBlock:26,group1:[4,20],group2:[6,21]},{dataCapacity:244,errorPerBlock:24,group1:[8,20],group2:[4,21]},{dataCapacity:261,errorPerBlock:20,group1:[11,16],group2:[5,17]},{dataCapacity:295,errorPerBlock:30,group1:[5,24],group2:[7,25]},{dataCapacity:325,errorPerBlock:24,group1:[15,19],group2:[2,20]},{dataCapacity:367,errorPerBlock:28,group1:[1,22],group2:[15,23]},{dataCapacity:397,errorPerBlock:28,group1:[17,22],group2:[1,23]},{dataCapacity:445,errorPerBlock:26,group1:[17,21],group2:[4,22]},{dataCapacity:485,errorPerBlock:30,group1:[15,24],group2:[5,25]},{dataCapacity:512,errorPerBlock:28,group1:[17,22],group2:[6,23]},{dataCapacity:568,errorPerBlock:30,group1:[7,24],group2:[16,25]},{dataCapacity:614,errorPerBlock:30,group1:[11,24],group2:[14,25]},{dataCapacity:664,errorPerBlock:30,group1:[11,24],group2:[16,25]},{dataCapacity:718,errorPerBlock:30,group1:[7,24],group2:[22,25]},{dataCapacity:754,errorPerBlock:28,group1:[28,22],group2:[6,23]},{dataCapacity:808,errorPerBlock:30,group1:[8,23],group2:[26,24]},{dataCapacity:871,errorPerBlock:30,group1:[4,24],group2:[31,25]},{dataCapacity:911,errorPerBlock:30,group1:[1,23],group2:[37,24]},{dataCapacity:985,errorPerBlock:30,group1:[15,24],group2:[25,25]},{dataCapacity:1033,errorPerBlock:30,group1:[42,24],group2:[1,25]},{dataCapacity:1115,errorPerBlock:30,group1:[10,24],group2:[35,25]},{dataCapacity:1171,errorPerBlock:30,group1:[29,24],group2:[19,25]},{dataCapacity:1231,errorPerBlock:30,group1:[44,24],group2:[7,25]},{dataCapacity:1286,errorPerBlock:30,group1:[39,24],group2:[14,25]},{dataCapacity:1354,errorPerBlock:30,group1:[46,24],group2:[10,25]},{dataCapacity:1426,errorPerBlock:30,group1:[49,24],group2:[10,25]},{dataCapacity:1502,errorPerBlock:30,group1:[48,24],group2:[14,25]},{dataCapacity:1582,errorPerBlock:30,group1:[43,24],group2:[22,25]},{dataCapacity:1666,errorPerBlock:30,group1:[34,24],group2:[34,25]}],
    H: [{dataCapacity:9,errorPerBlock:17,group1:[1,9],group2:[0,0]},{dataCapacity:16,errorPerBlock:28,group1:[1,16],group2:[0,0]},{dataCapacity:26,errorPerBlock:22,group1:[2,13],group2:[0,0]},{dataCapacity:36,errorPerBlock:16,group1:[4,9],group2:[0,0]},{dataCapacity:46,errorPerBlock:22,group1:[2,11],group2:[2,12]},{dataCapacity:60,errorPerBlock:28,group1:[4,15],group2:[0,0]},{dataCapacity:66,errorPerBlock:26,group1:[4,13],group2:[1,14]},{dataCapacity:86,errorPerBlock:26,group1:[4,14],group2:[2,15]},{dataCapacity:100,errorPerBlock:24,group1:[4,12],group2:[4,13]},{dataCapacity:122,errorPerBlock:28,group1:[6,15],group2:[2,16]},{dataCapacity:140,errorPerBlock:24,group1:[3,12],group2:[8,13]},{dataCapacity:158,errorPerBlock:28,group1:[7,14],group2:[4,15]},{dataCapacity:180,errorPerBlock:22,group1:[12,11],group2:[4,12]},{dataCapacity:197,errorPerBlock:24,group1:[11,12],group2:[5,13]},{dataCapacity:223,errorPerBlock:24,group1:[11,12],group2:[7,13]},{dataCapacity:253,errorPerBlock:30,group1:[3,15],group2:[13,16]},{dataCapacity:283,errorPerBlock:28,group1:[2,14],group2:[17,15]},{dataCapacity:313,errorPerBlock:28,group1:[2,14],group2:[19,15]},{dataCapacity:341,errorPerBlock:26,group1:[9,13],group2:[16,14]},{dataCapacity:385,errorPerBlock:28,group1:[15,15],group2:[10,16]},{dataCapacity:406,errorPerBlock:30,group1:[19,16],group2:[6,17]},{dataCapacity:442,errorPerBlock:24,group1:[34,13],group2:[0,0]},{dataCapacity:464,errorPerBlock:30,group1:[16,15],group2:[14,16]},{dataCapacity:514,errorPerBlock:30,group1:[30,16],group2:[2,17]},{dataCapacity:538,errorPerBlock:30,group1:[22,15],group2:[13,16]},{dataCapacity:596,errorPerBlock:30,group1:[33,16],group2:[4,17]},{dataCapacity:628,errorPerBlock:30,group1:[12,15],group2:[28,16]},{dataCapacity:661,errorPerBlock:30,group1:[11,15],group2:[31,16]},{dataCapacity:701,errorPerBlock:30,group1:[19,15],group2:[26,16]},{dataCapacity:745,errorPerBlock:30,group1:[23,15],group2:[25,16]},{dataCapacity:793,errorPerBlock:30,group1:[23,15],group2:[28,16]},{dataCapacity:845,errorPerBlock:30,group1:[19,15],group2:[35,16]},{dataCapacity:901,errorPerBlock:30,group1:[11,15],group2:[46,16]},{dataCapacity:961,errorPerBlock:30,group1:[59,16],group2:[1,17]},{dataCapacity:986,errorPerBlock:30,group1:[22,15],group2:[41,16]},{dataCapacity:1054,errorPerBlock:30,group1:[2,15],group2:[64,16]},{dataCapacity:1096,errorPerBlock:30,group1:[24,15],group2:[46,16]},{dataCapacity:1142,errorPerBlock:30,group1:[42,15],group2:[32,16]},{dataCapacity:1222,errorPerBlock:30,group1:[10,15],group2:[67,16]},{dataCapacity:1276,errorPerBlock:30,group1:[20,15],group2:[61,16]}],
}

const Galois_Field_Table = [
    //{exp: , int: }
]
function calcPowTwo(int = 0.5, exp = 0) {
    if (exp > 255) return;
    int *= 2;
    int = int > 255 ? int ^ 285 : int;
    Galois_Field_Table.push({exp , int});
    return calcPowTwo(int, exp + 1);
}
calcPowTwo();

const Remainder_Bits = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0];

const Alignment_Pattern_Locations_Table = [[0],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]]

const Format_Information_Table = {
    L: ['111011111000100', '111001011110011', '111110110101010', '111100010011101', '110011000101111', '110001100011000', '110110001000001', '110100101110110'],
    M: ['101010000010010', '101000100100101', '101111001111100', '101101101001011', '100010111111001', '100000011001110', '100111110010111', '100101010100000'],
    Q: ['011010101011111', '011000001101000', '011111100110001', '011101000000110', '010010010110100', '010000110000011', '010111011011010', '010101111101101'],
    H: ['001011010001001', '001001110111110', '001110011100111', '001100111010000', '000011101100010', '000001001010101', '000110100001100', '000100000111011'],
}

const Version_Information_Table = ['000111110010010100', '001000010110111100', '001001101010011001', '001010010011010011', '001011101111110110', '001100011101100010', '001101100001000111', '001110011000001101', '001111100100101000', '010000101101111000', '010001010001011101', '010010101000010111', '010011010100110010', '010100100110100110', '010101011010000011', '010110100011001001', '010111011111101100', '011000111011000100', '011001000111100001', '011010111110101011', '011011000010001110', '011100110000011010', '011101001100111111', '011110110101110101', '011111001001010000', '100000100111010101', '100001011011110000', '100010100010111010', '100011011110011111', '100100101100001011', '100101010000101110', '100110101001100100', '100111010101000001', '101000110001101001']

/***/ }),

/***/ "./src/qrcode/qrcode.js":
/*!******************************!*\
  !*** ./src/qrcode/qrcode.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _encoding_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding-service */ "./src/qrcode/encoding-service.js");
/* harmony import */ var _encoding_structure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./encoding-structure */ "./src/qrcode/encoding-structure.js");



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

        const {data, version} = (0,_encoding_service__WEBPACK_IMPORTED_MODULE_0__.qrEncodedData)(value, errorCorrection);

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

        const testAry = (0,_encoding_service__WEBPACK_IMPORTED_MODULE_0__.getFinalQrAry)(dataMap, this.qrSize, this.dataIds, errorCorrection, version);

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
        const alignPos = _encoding_structure__WEBPACK_IMPORTED_MODULE_1__.Alignment_Pattern_Locations_Table[version - 1];
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _barcode_barcode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./barcode/barcode */ "./src/barcode/barcode.js");
/* harmony import */ var _qrcode_qrcode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./qrcode/qrcode */ "./src/qrcode/qrcode.js");


})();

/******/ })()
;
//# sourceMappingURL=bundle.c6c3ecaf2fc4863d367e.js.map