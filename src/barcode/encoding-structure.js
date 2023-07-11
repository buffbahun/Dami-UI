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

export {
    EAN13_STRUCTURE,
    EAN_UPC_ENCODING,
    EAN_UPC_MARKERS,
    EAN8_STRUCTURE,
    UPCA_STRUCTURE,
    UPCE_STRUCTURE,
    UPCE_PATTERN,
    UPCE_MARKERS,
    CODE11_ENCODING,
    CODE11_MARKERS,
    CODE39_CHARACTERS,
    CODE39_BARS,
    CODE39_SPACES,
    CODE39_MARKERS,
    CODE39_OTHER_CHARACTERS,
    CODE39_OTHER_CHARACTERS_ENCODE
}