import {Character_Capacity_Table, Character_Count_Indicator, Mode_Indicator, Alphanumeric_Code, Error_Correction_Code_Table, Galois_Field_Table, Remainder_Bits, Format_Information_Table} from "./encoding-structure";

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

export function qrEncodedData(value, correctionLevel) {
    const modeType = getQrMode(value);

    if (!modeType) return;

    const {capacity, version} = getCodeCapacityAndVersion(value, modeType, correctionLevel);

    if (!capacity || !version) return;

    const modeIndicator = Mode_Indicator.get(modeType);

    const characterCountIndicator = getCharacterCountIndicator(value, version, modeType);

    const encodedData = encodeData(value, modeType);

    if (!modeIndicator || !characterCountIndicator || !encodedData) return;

    const dataAry = [modeIndicator, characterCountIndicator, encodedData];

    const dataCapacity = Error_Correction_Code_Table[correctionLevel][version - 1].dataCapacity;
    const errorPerBlock = Error_Correction_Code_Table[correctionLevel][version - 1].errorPerBlock;
    const group1 = Error_Correction_Code_Table[correctionLevel][version - 1].group1;
    const group2 = Error_Correction_Code_Table[correctionLevel][version - 1].group2;

    if (!dataCapacity || !errorPerBlock) return;

    const encodedAry = encodedDataWithPaddings(dataAry, dataCapacity);

    const codeBlocks = getAllCodeBlocks(encodedAry, group1, group2);
    const errorBlocks = getAllErrorCorectionCode(errorPerBlock, codeBlocks);

    const encodedDataWithErrorCorrection = interleaveDataBlocks(codeBlocks) + interleaveDataBlocks(errorBlocks);
    const remainderBits = Remainder_Bits[version - 1];

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
    return Galois_Field_Table.find(val => val.exp === exp).int;
}

function findExp(int) {
    return Galois_Field_Table.find(val => val.int === int).exp;
}

export function getFinalQrAry(qrAry, qrSize, dataIds, correctionLevel, version) {
    const qrArysWithFormatAndVersionInfo = getQrArysWithFormatAndVersionInfo([...qrAry], qrSize, correctionLevel, version);
    const maskedQrArys = getMaskedQrArys(qrArysWithFormatAndVersionInfo, dataIds, qrSize);
    const qrAryWithMinPenalty = getQrAryWithMinPenalty(maskedQrArys, qrSize);

    return qrAryWithMinPenalty;
}

function getQrArysWithFormatAndVersionInfo(qrAry, qrSize, correctionLevel, version) {
    const qrArysWithInfo = [];
    getQrArysWithFormatInfo(qrAry, qrSize, correctionLevel, qrArysWithInfo);
    //getQrArysWithVersionInfo(qrAry, qrSize, version, qrArysWithInfo);

    return qrArysWithInfo;
}

function getQrArysWithFormatInfo(qrAry, qrSize, correctionLevel, qrArysWithInfo) {
    const formatBitsAry = Format_Information_Table[correctionLevel];

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