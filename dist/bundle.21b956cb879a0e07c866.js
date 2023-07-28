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
/* harmony export */   encodeData: () => (/* binding */ encodeData)
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
    const charLength = value.length;

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
    const charLength = value.length;
    const charCountLength = characterCountSize(version, modeType);

    const charLenInBinary = charLength.toString(2).split("");

    while (charLenInBinary.length < charCountLength) {
        charLenInBinary.unshift("0");
    }

    return charLenInBinary.join("");
}

function encodeData(value, correctionLevel) {
    const modeType = getQrMode(value);

    if (!modeType) return;

    const {capacity, version} = getCodeCapacityAndVersion(value, modeType, correctionLevel);

    if (!capacity || !version) return;

    const modeIndicator = _encoding_structure__WEBPACK_IMPORTED_MODULE_0__.Mode_Indicator.get(modeType);

    const characterCountIndicator = getCharacterCountIndicator(value, version, modeType);

    if (!modeIndicator || !characterCountIndicator) return;

    return [modeIndicator, characterCountIndicator];
}

/***/ }),

/***/ "./src/qrcode/encoding-structure.js":
/*!******************************************!*\
  !*** ./src/qrcode/encoding-structure.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Character_Capacity_Table: () => (/* binding */ Character_Capacity_Table),
/* harmony export */   Character_Count_Indicator: () => (/* binding */ Character_Count_Indicator),
/* harmony export */   Error_Correction_Level: () => (/* binding */ Error_Correction_Level),
/* harmony export */   Mode_Indicator: () => (/* binding */ Mode_Indicator)
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

/***/ }),

/***/ "./src/qrcode/qrcode.js":
/*!******************************!*\
  !*** ./src/qrcode/qrcode.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _encoding_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encoding-service */ "./src/qrcode/encoding-service.js");


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
    }

    initShadow() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.svgElm = shadow.querySelector("svg");
    }

    connectedCallback() {
        console.log((0,_encoding_service__WEBPACK_IMPORTED_MODULE_0__.encodeData)("HELLO WORLD", "Q"));
    }

    static get observedAttributes() {
        return [];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        
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
//# sourceMappingURL=bundle.21b956cb879a0e07c866.js.map