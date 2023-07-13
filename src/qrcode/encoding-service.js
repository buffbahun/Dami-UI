import {Character_Capacity_Table, Character_Count_Indicator, Mode_Indicator, Alphanumeric_Code, Error_Correction_Code_Table} from "./encoding-structure";

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

    const capacity = Character_Capacity_Table[modeType][correctionLevel].find(val => val >= charLength);
    const version = Character_Capacity_Table[modeType][correctionLevel].indexOf(capacity) + 1;

    return {capacity, version};
}

function characterCountSize(version, modeType) {
    if (version <= 9) {
        return Character_Count_Indicator[0][modeType];
    } else if (version <= 26) {
        return Character_Count_Indicator[1][modeType];
    } else {
        return Character_Count_Indicator[2][modeType];
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

export function encodeDataWithStartAndEndBits(value, correctionLevel) {
    const modeType = getQrMode(value);

    if (!modeType) return;

    const {capacity, version} = getCodeCapacityAndVersion(value, modeType, correctionLevel);

    if (!capacity || !version) return;

    const modeIndicator = Mode_Indicator.get(modeType);

    const characterCountIndicator = getCharacterCountIndicator(value, version, modeType);

    const encodedData = encodeData(value, modeType);

    if (!modeIndicator || !characterCountIndicator || !encodedData) return;

    const dataAry = [modeIndicator, characterCountIndicator, encodedData];

    const dataCapacity = Error_Correction_Code_Table[correctionLevel][version - 1];

    if (!dataCapacity) return;

    const encodedAry = encodedDataWithPaddings(dataAry, dataCapacity);

    return encodedAry;
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
            const num = (45 * Alphanumeric_Code.get(str[0])) + Alphanumeric_Code.get(str[1]);
            binaryForm = num.toString(2);
        } else {
            const num = Alphanumeric_Code.get(str[0]);
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