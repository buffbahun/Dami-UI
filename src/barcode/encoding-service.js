import { CODE11_ENCODING, CODE11_MARKERS, EAN13_STRUCTURE, EAN8_STRUCTURE, EAN_UPC_ENCODING, EAN_UPC_MARKERS, UPCA_STRUCTURE, UPCE_MARKERS, UPCE_PATTERN, UPCE_STRUCTURE, CODE39_CHARACTERS, CODE39_BARS, CODE39_SPACES, CODE39_MARKERS, CODE39_OTHER_CHARACTERS, CODE39_OTHER_CHARACTERS_ENCODE } from './encoding-structure';

export function calcChecksumEanUpc(value) {
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

export function eanUpcEncoder(value, type) {
    let struct;
    if (type === "EAN13") {
      struct = EAN13_STRUCTURE.get(value[0]);
      value = value.slice(1) + calcChecksumEanUpc(value);
    }

    if (type === "EAN8") {
      struct = EAN8_STRUCTURE.get("0");
      value = value + calcChecksumEanUpc(value);
    }

    if (type === "UPCA") {
      struct = UPCA_STRUCTURE.get("0");
      value = value + calcChecksumEanUpc(value);
    }

    if (type === "UPCE") {
      let lastDigit = value[value.length - 1];
      let valAry = value.split("").reverse();
      let pattern = UPCE_PATTERN.get(lastDigit);
      if (!pattern) return;
      let upcaEquv = pattern.split("").map(chr => {
        if (chr === "X") return valAry.pop();
        return chr;
      }).join("");
      let checksum = calcChecksumEanUpc(upcaEquv);
      struct = UPCE_STRUCTURE.get(checksum);
      struct.lastGroup = "";
    }

    if (!struct) return;

    let encode = "";

    encode += EAN_UPC_MARKERS.startMarker;

    for (const [index, str] of (struct.firstGroup + struct.lastGroup).split("").entries()) {
      switch (str) {
        case "L":
          encode += EAN_UPC_ENCODING.get(value[index])?.lCode;
          break;
        case "G":
          encode += EAN_UPC_ENCODING.get(value[index])?.gCode;
          break;
        case "R":
          encode += EAN_UPC_ENCODING.get(value[index])?.rCode;
          break;
      }

      if (type !== "UPCE" && index === struct.firstGroup.length - 1) {
        encode += EAN_UPC_MARKERS.centerMarker;
      }
    }

    encode += (type === "UPCE" ? UPCE_MARKERS.endMarker : EAN_UPC_MARKERS.endMarker);

    return encode;

}

export function calcChecksumCode11(value) {
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

export function code11Encoder(value) {
    value = value + calcChecksumEanUpc(value);

    let encode = "";

    encode += CODE11_MARKERS.startMarker;
    encode += "0"; // Gap between codes

    for (const chr of value) {
      let code = CODE11_ENCODING.get(chr);
      if (code) {
        encode += code;
        encode += "0";
      }
    }

    encode += CODE11_MARKERS.endMarker;

    return encode;
}

export function code39Encoder(value) {
  const charList = value.split("");
  charList.push("*");
  charList.unshift("*");

  const encode = [];

  charList.forEach(chr => {
    const chrIndex = CODE39_CHARACTERS.indexOf(chr);
    const otherChrIndex = CODE39_OTHER_CHARACTERS.indexOf(chr);

    if (chrIndex < 0 && otherChrIndex >= 0) {
      encode.push( CODE39_OTHER_CHARACTERS_ENCODE.get(chr) );
      return;
    }

    const spacePos = CODE39_SPACES[ Math.trunc( chrIndex / 10 ) ];
    const barsPos = CODE39_BARS[ chrIndex % 10 ];

    const chrCode = [];

    for (let i = 1; i < 10; i++) {
      if (spacePos === i) chrCode.push(CODE39_MARKERS.space);
      else if (barsPos.includes(i)) chrCode.push(CODE39_MARKERS.bar);
      else chrCode.push(i % 2);
    }

    encode.push( chrCode.join("") );
  });

  return encode.join(CODE39_MARKERS.narrowSpace);
}


export function chooseEncodingType(type, value) {
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
