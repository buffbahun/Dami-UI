export const Error_Correction_Level = new Map([
    ["L", 7],
    ["M", 15],
    ["Q", 25],
    ["H", 30],
]);

export const Mode_Indicator = new Map([
    ["numeric", "0001"],
    ["alphanumeric", "0010"],
    ["byte", "0100"],
]);

export const Character_Capacity_Table = {
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

export const Character_Count_Indicator = [
    {numeric: 10, alphanumeric: 9, byte: 8},
    {numeric: 12, alphanumeric: 11, byte: 16},
    {numeric: 14, alphanumeric: 13, byte: 16},
]

export const Alphanumeric_Code = new Map([
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

export const Error_Correction_Code_Table = {
    L: [{dataCapacity:19,errorPerBlock:7,group1:[1,19],group2:[0,0]},{dataCapacity:34,errorPerBlock:10,group1:[1,34],group2:[0,0]},{dataCapacity:55,errorPerBlock:15,group1:[1,55],group2:[0,0]},{dataCapacity:80,errorPerBlock:20,group1:[1,80],group2:[0,0]},{dataCapacity:108,errorPerBlock:26,group1:[1,108],group2:[0,0]},{dataCapacity:136,errorPerBlock:18,group1:[2,68],group2:[0,0]},{dataCapacity:156,errorPerBlock:20,group1:[2,78],group2:[0,0]},{dataCapacity:194,errorPerBlock:24,group1:[2,97],group2:[0,0]},{dataCapacity:232,errorPerBlock:30,group1:[2,116],group2:[0,0]},{dataCapacity:274,errorPerBlock:18,group1:[2,68],group2:[2,69]},{dataCapacity:324,errorPerBlock:20,group1:[4,81],group2:[0,0]},{dataCapacity:370,errorPerBlock:24,group1:[2,92],group2:[2,93]},{dataCapacity:428,errorPerBlock:26,group1:[4,107],group2:[0,0]},{dataCapacity:461,errorPerBlock:30,group1:[3,115],group2:[1,116]},{dataCapacity:523,errorPerBlock:22,group1:[5,87],group2:[1,88]},{dataCapacity:589,errorPerBlock:24,group1:[5,98],group2:[1,99]},{dataCapacity:647,errorPerBlock:28,group1:[1,107],group2:[5,108]},{dataCapacity:721,errorPerBlock:30,group1:[5,120],group2:[1,121]},{dataCapacity:795,errorPerBlock:28,group1:[3,113],group2:[4,114]},{dataCapacity:861,errorPerBlock:28,group1:[3,107],group2:[5,108]},{dataCapacity:932,errorPerBlock:28,group1:[4,116],group2:[4,117]},{dataCapacity:1006,errorPerBlock:28,group1:[2,111],group2:[7,112]},{dataCapacity:1094,errorPerBlock:30,group1:[4,121],group2:[5,122]},{dataCapacity:1174,errorPerBlock:30,group1:[6,117],group2:[4,118]},{dataCapacity:1276,errorPerBlock:26,group1:[8,106],group2:[4,107]},{dataCapacity:1370,errorPerBlock:28,group1:[10,114],group2:[2,115]},{dataCapacity:1468,errorPerBlock:30,group1:[8,122],group2:[4,123]},{dataCapacity:1531,errorPerBlock:30,group1:[3,117],group2:[10,118]},{dataCapacity:1631,errorPerBlock:30,group1:[7,116],group2:[7,117]},{dataCapacity:1735,errorPerBlock:30,group1:[5,115],group2:[10,116]},{dataCapacity:1843,errorPerBlock:30,group1:[13,115],group2:[3,116]},{dataCapacity:1955,errorPerBlock:30,group1:[17,115],group2:[0,0]},{dataCapacity:2071,errorPerBlock:30,group1:[17,115],group2:[1,116]},{dataCapacity:2191,errorPerBlock:30,group1:[13,115],group2:[6,116]},{dataCapacity:2306,errorPerBlock:30,group1:[12,121],group2:[7,122]},{dataCapacity:2434,errorPerBlock:30,group1:[6,121],group2:[14,122]},{dataCapacity:2566,errorPerBlock:30,group1:[17,122],group2:[4,123]},{dataCapacity:2702,errorPerBlock:30,group1:[4,122],group2:[18,123]},{dataCapacity:2812,errorPerBlock:30,group1:[20,117],group2:[4,118]},{dataCapacity:2956,errorPerBlock:30,group1:[19,118],group2:[6,119]}],
    M: [{dataCapacity:16,errorPerBlock:10,group1:[1,16],group2:[0,0]},{dataCapacity:28,errorPerBlock:16,group1:[1,28],group2:[0,0]},{dataCapacity:44,errorPerBlock:26,group1:[1,44],group2:[0,0]},{dataCapacity:64,errorPerBlock:18,group1:[2,32],group2:[0,0]},{dataCapacity:86,errorPerBlock:24,group1:[2,43],group2:[0,0]},{dataCapacity:108,errorPerBlock:16,group1:[4,27],group2:[0,0]},{dataCapacity:124,errorPerBlock:18,group1:[4,31],group2:[0,0]},{dataCapacity:154,errorPerBlock:22,group1:[2,38],group2:[2,39]},{dataCapacity:182,errorPerBlock:22,group1:[3,36],group2:[2,37]},{dataCapacity:216,errorPerBlock:26,group1:[4,43],group2:[1,44]},{dataCapacity:254,errorPerBlock:30,group1:[1,50],group2:[4,51]},{dataCapacity:290,errorPerBlock:22,group1:[6,36],group2:[2,37]},{dataCapacity:334,errorPerBlock:22,group1:[8,37],group2:[1,38]},{dataCapacity:365,errorPerBlock:24,group1:[4,40],group2:[5,41]},{dataCapacity:415,errorPerBlock:24,group1:[5,41],group2:[5,42]},{dataCapacity:453,errorPerBlock:28,group1:[7,45],group2:[3,46]},{dataCapacity:507,errorPerBlock:28,group1:[10,46],group2:[1,47]},{dataCapacity:563,errorPerBlock:26,group1:[9,43],group2:[4,44]},{dataCapacity:627,errorPerBlock:26,group1:[3,44],group2:[11,45]},{dataCapacity:669,errorPerBlock:26,group1:[3,41],group2:[13,42]},{dataCapacity:714,errorPerBlock:26,group1:[17,42],group2:[0,0]},{dataCapacity:782,errorPerBlock:28,group1:[17,46],group2:[0,0]},{dataCapacity:860,errorPerBlock:28,group1:[4,47],group2:[14,48]},{dataCapacity:914,errorPerBlock:28,group1:[6,45],group2:[14,46]},{dataCapacity:1000,errorPerBlock:28,group1:[8,47],group2:[13,48]},{dataCapacity:1062,errorPerBlock:28,group1:[19,46],group2:[4,47]},{dataCapacity:1128,errorPerBlock:28,group1:[22,45],group2:[3,46]},{dataCapacity:1193,errorPerBlock:28,group1:[3,45],group2:[23,46]},{dataCapacity:1267,errorPerBlock:28,group1:[21,45],group2:[7,46]},{dataCapacity:1373,errorPerBlock:28,group1:[19,47],group2:[10,48]},{dataCapacity:1455,errorPerBlock:28,group1:[2,46],group2:[29,47]},{dataCapacity:1541,errorPerBlock:28,group1:[10,46],group2:[23,47]},{dataCapacity:1631,errorPerBlock:28,group1:[14,46],group2:[21,47]},{dataCapacity:1725,errorPerBlock:28,group1:[14,46],group2:[23,47]},{dataCapacity:1812,errorPerBlock:28,group1:[12,47],group2:[26,48]},{dataCapacity:1914,errorPerBlock:28,group1:[6,47],group2:[34,48]},{dataCapacity:1992,errorPerBlock:28,group1:[29,46],group2:[14,47]},{dataCapacity:2102,errorPerBlock:28,group1:[13,46],group2:[32,47]},{dataCapacity:2216,errorPerBlock:28,group1:[40,47],group2:[7,48]},{dataCapacity:2334,errorPerBlock:28,group1:[18,47],group2:[31,48]}],
    Q: [{dataCapacity:13,errorPerBlock:13,group1:[1,13],group2:[0,0]},{dataCapacity:22,errorPerBlock:22,group1:[1,22],group2:[0,0]},{dataCapacity:34,errorPerBlock:18,group1:[2,17],group2:[0,0]},{dataCapacity:48,errorPerBlock:26,group1:[2,24],group2:[0,0]},{dataCapacity:62,errorPerBlock:18,group1:[2,15],group2:[2,16]},{dataCapacity:76,errorPerBlock:24,group1:[4,19],group2:[0,0]},{dataCapacity:88,errorPerBlock:18,group1:[2,14],group2:[4,15]},{dataCapacity:110,errorPerBlock:22,group1:[4,18],group2:[2,19]},{dataCapacity:132,errorPerBlock:20,group1:[4,16],group2:[4,17]},{dataCapacity:154,errorPerBlock:24,group1:[6,19],group2:[2,20]},{dataCapacity:180,errorPerBlock:28,group1:[4,22],group2:[4,23]},{dataCapacity:206,errorPerBlock:26,group1:[4,20],group2:[6,21]},{dataCapacity:244,errorPerBlock:24,group1:[8,20],group2:[4,21]},{dataCapacity:261,errorPerBlock:20,group1:[11,16],group2:[5,17]},{dataCapacity:295,errorPerBlock:30,group1:[5,24],group2:[7,25]},{dataCapacity:325,errorPerBlock:24,group1:[15,19],group2:[2,20]},{dataCapacity:367,errorPerBlock:28,group1:[1,22],group2:[15,23]},{dataCapacity:397,errorPerBlock:28,group1:[17,22],group2:[1,23]},{dataCapacity:445,errorPerBlock:26,group1:[17,21],group2:[4,22]},{dataCapacity:485,errorPerBlock:30,group1:[15,24],group2:[5,25]},{dataCapacity:512,errorPerBlock:28,group1:[17,22],group2:[6,23]},{dataCapacity:568,errorPerBlock:30,group1:[7,24],group2:[16,25]},{dataCapacity:614,errorPerBlock:30,group1:[11,24],group2:[14,25]},{dataCapacity:664,errorPerBlock:30,group1:[11,24],group2:[16,25]},{dataCapacity:718,errorPerBlock:30,group1:[7,24],group2:[22,25]},{dataCapacity:754,errorPerBlock:28,group1:[28,22],group2:[6,23]},{dataCapacity:808,errorPerBlock:30,group1:[8,23],group2:[26,24]},{dataCapacity:871,errorPerBlock:30,group1:[4,24],group2:[31,25]},{dataCapacity:911,errorPerBlock:30,group1:[1,23],group2:[37,24]},{dataCapacity:985,errorPerBlock:30,group1:[15,24],group2:[25,25]},{dataCapacity:1033,errorPerBlock:30,group1:[42,24],group2:[1,25]},{dataCapacity:1115,errorPerBlock:30,group1:[10,24],group2:[35,25]},{dataCapacity:1171,errorPerBlock:30,group1:[29,24],group2:[19,25]},{dataCapacity:1231,errorPerBlock:30,group1:[44,24],group2:[7,25]},{dataCapacity:1286,errorPerBlock:30,group1:[39,24],group2:[14,25]},{dataCapacity:1354,errorPerBlock:30,group1:[46,24],group2:[10,25]},{dataCapacity:1426,errorPerBlock:30,group1:[49,24],group2:[10,25]},{dataCapacity:1502,errorPerBlock:30,group1:[48,24],group2:[14,25]},{dataCapacity:1582,errorPerBlock:30,group1:[43,24],group2:[22,25]},{dataCapacity:1666,errorPerBlock:30,group1:[34,24],group2:[34,25]}],
    H: [{dataCapacity:9,errorPerBlock:17,group1:[1,9],group2:[0,0]},{dataCapacity:16,errorPerBlock:28,group1:[1,16],group2:[0,0]},{dataCapacity:26,errorPerBlock:22,group1:[2,13],group2:[0,0]},{dataCapacity:36,errorPerBlock:16,group1:[4,9],group2:[0,0]},{dataCapacity:46,errorPerBlock:22,group1:[2,11],group2:[2,12]},{dataCapacity:60,errorPerBlock:28,group1:[4,15],group2:[0,0]},{dataCapacity:66,errorPerBlock:26,group1:[4,13],group2:[1,14]},{dataCapacity:86,errorPerBlock:26,group1:[4,14],group2:[2,15]},{dataCapacity:100,errorPerBlock:24,group1:[4,12],group2:[4,13]},{dataCapacity:122,errorPerBlock:28,group1:[6,15],group2:[2,16]},{dataCapacity:140,errorPerBlock:24,group1:[3,12],group2:[8,13]},{dataCapacity:158,errorPerBlock:28,group1:[7,14],group2:[4,15]},{dataCapacity:180,errorPerBlock:22,group1:[12,11],group2:[4,12]},{dataCapacity:197,errorPerBlock:24,group1:[11,12],group2:[5,13]},{dataCapacity:223,errorPerBlock:24,group1:[11,12],group2:[7,13]},{dataCapacity:253,errorPerBlock:30,group1:[3,15],group2:[13,16]},{dataCapacity:283,errorPerBlock:28,group1:[2,14],group2:[17,15]},{dataCapacity:313,errorPerBlock:28,group1:[2,14],group2:[19,15]},{dataCapacity:341,errorPerBlock:26,group1:[9,13],group2:[16,14]},{dataCapacity:385,errorPerBlock:28,group1:[15,15],group2:[10,16]},{dataCapacity:406,errorPerBlock:30,group1:[19,16],group2:[6,17]},{dataCapacity:442,errorPerBlock:24,group1:[34,13],group2:[0,0]},{dataCapacity:464,errorPerBlock:30,group1:[16,15],group2:[14,16]},{dataCapacity:514,errorPerBlock:30,group1:[30,16],group2:[2,17]},{dataCapacity:538,errorPerBlock:30,group1:[22,15],group2:[13,16]},{dataCapacity:596,errorPerBlock:30,group1:[33,16],group2:[4,17]},{dataCapacity:628,errorPerBlock:30,group1:[12,15],group2:[28,16]},{dataCapacity:661,errorPerBlock:30,group1:[11,15],group2:[31,16]},{dataCapacity:701,errorPerBlock:30,group1:[19,15],group2:[26,16]},{dataCapacity:745,errorPerBlock:30,group1:[23,15],group2:[25,16]},{dataCapacity:793,errorPerBlock:30,group1:[23,15],group2:[28,16]},{dataCapacity:845,errorPerBlock:30,group1:[19,15],group2:[35,16]},{dataCapacity:901,errorPerBlock:30,group1:[11,15],group2:[46,16]},{dataCapacity:961,errorPerBlock:30,group1:[59,16],group2:[1,17]},{dataCapacity:986,errorPerBlock:30,group1:[22,15],group2:[41,16]},{dataCapacity:1054,errorPerBlock:30,group1:[2,15],group2:[64,16]},{dataCapacity:1096,errorPerBlock:30,group1:[24,15],group2:[46,16]},{dataCapacity:1142,errorPerBlock:30,group1:[42,15],group2:[32,16]},{dataCapacity:1222,errorPerBlock:30,group1:[10,15],group2:[67,16]},{dataCapacity:1276,errorPerBlock:30,group1:[20,15],group2:[61,16]}],
}

export const Galois_Field_Table = [
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

export const Remainder_Bits = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0];

export const Alignment_Pattern_Locations_Table = [[0],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]]

export const Format_Information_Table = {
    L: ['111011111000100', '111001011110011', '111110110101010', '111100010011101', '110011000101111', '110001100011000', '110110001000001', '110100101110110'],
    M: ['101010000010010', '101000100100101', '101111001111100', '101101101001011', '100010111111001', '100000011001110', '100111110010111', '100101010100000'],
    Q: ['011010101011111', '011000001101000', '011111100110001', '011101000000110', '010010010110100', '010000110000011', '010111011011010', '010101111101101'],
    H: ['001011010001001', '001001110111110', '001110011100111', '001100111010000', '000011101100010', '000001001010101', '000110100001100', '000100000111011'],
}

export const Version_Information_Table = ['000111110010010100', '001000010110111100', '001001101010011001', '001010010011010011', '001011101111110110', '001100011101100010', '001101100001000111', '001110011000001101', '001111100100101000', '010000101101111000', '010001010001011101', '010010101000010111', '010011010100110010', '010100100110100110', '010101011010000011', '010110100011001001', '010111011111101100', '011000111011000100', '011001000111100001', '011010111110101011', '011011000010001110', '011100110000011010', '011101001100111111', '011110110101110101', '011111001001010000', '100000100111010101', '100001011011110000', '100010100010111010', '100011011110011111', '100100101100001011', '100101010000101110', '100110101001100100', '100111010101000001', '101000110001101001']