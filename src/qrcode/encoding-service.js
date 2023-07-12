import {Character_Capacity_Table, Character_Count_Indicator, Mode_Indicator, Alphanumeric_Code} from "./encoding-structure";

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
    const charLength = value.length;
    const charCountLength = characterCountSize(version, modeType);

    const charLenInBinary = charLength.toString(2).split("");

    while (charLenInBinary.length < charCountLength) {
        charLenInBinary.unshift("0");
    }

    return charLenInBinary.join("");
}

export function encodeDataWithStartBits(value, correctionLevel) {
    const modeType = getQrMode(value);

    if (!modeType) return;

    const {capacity, version} = getCodeCapacityAndVersion(value, modeType, correctionLevel);

    if (!capacity || !version) return;

    const modeIndicator = Mode_Indicator.get(modeType);

    const characterCountIndicator = getCharacterCountIndicator(value, version, modeType);

    const encodedData = encodeData(value, modeType);

    if (!modeIndicator || !characterCountIndicator || !encodedData) return;

    return [modeIndicator, characterCountIndicator, encodedData];
}

function encodeData(value, modeType) {
    if (modeType === "numeric") {
        return encodeNumericData(value);
    } else if (modeType === "alphanumeric") {
        return encodeAlphanumericData(value);
    } else if (modeType === "byte") {
        //return encodeByteData(value);
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

        if (numLen === 3 && binaryForm.length < 10) {
            while (binaryForm.length < 10) binaryForm = "0" + binaryForm;
        }
        if (numLen === 2 && binaryForm.length < 7) {
            while (binaryForm.length < 7) binaryForm = "0" + binaryForm;
        }
        if (numLen === 1 && binaryForm.length < 4) {
            while (binaryForm.length < 4) binaryForm = "0" + binaryForm;
        }

        binaryAry.push(binaryForm);
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

        if (str.length === 2 && binaryForm.length < 11) {
            while (binaryForm.length < 11) binaryForm = "0" + binaryForm;
        }
        if (str.length === 1 && binaryForm.length < 6) {
            while (binaryForm.length < 6) binaryForm = "0" + binaryForm;
        }
        
        binaryAry.push(binaryForm);
    });

    return binaryAry;
}