'use strict';

import * as THREE from 'three';

export class RayysWebColors {
    constructor() {
        const colors = this.getColors();
        const toThreeColor = color => new THREE.Color(color.rgb.r / 256.0, color.rgb.g / 256.0, color.rgb.b / 256.0);

        this.getRandom = function() {
            const color = colors[Math.floor(colors.length * Math.random())];
            return toThreeColor(color);
        };

        this.findByName = function(name) {
            const idx = colors.indexOf(el => el.name.toLowerCase() === name.toLowerCase());
            if (idx === -1) {
                return null;
            }
            const color = colors[idx];
            return toThreeColor(color);
        };
    }

    getColors() {
        return [
            { name: "Pink", hex: 0xFFC0CB, rgb: {r:255, g:192, b:203} },
            { name: "LightPink", hex: 0xFFB6C1, rgb: {r:255, g:182, b:193} },
            { name: "HotPink", hex: 0xFF69B4, rgb: {r:255, g:105, b:180} },
            { name: "DeepPink", hex: 0xFF1493, rgb: {r:255, g:20, b:147} },
            { name: "PaleVioletRed", hex: 0xDB7093, rgb: {r:219, g:112, b:147} },
            { name: "MediumVioletRed", hex: 0xC71585, rgb: {r:199, g:21, b:133} },
            
            { name: "LightSalmon", hex: 0xFFA07A, rgb: {r:255, g:160, b:122} },
            { name: "Salmon", hex: 0xFA8072, rgb: {r:250, g:128, b:114} },
            { name: "DarkSalmon", hex: 0xE9967A, rgb: {r:233, g:150, b:122} },
            { name: "LightCoral", hex: 0xF08080, rgb: {r:240, g:128, b:128} },
            { name: "IndianRed", hex: 0xCD5C5C, rgb: {r:205, g:92, b:92} },
            { name: "Crimson", hex: 0xDC143C, rgb: {r:220, g:20, b:60} },
            { name: "FireBrick", hex: 0xB22222, rgb: {r:178, g:34, b:34} },
            { name: "DarkRed", hex: 0x8B0000, rgb: {r:139, g:0, b:0} },
            { name: "Red", hex: 0xFF0000, rgb: {r:255, g:0, b:0} },
            
            { name: "OrangeRed", hex: 0xFF4500, rgb: {r:255, g:69, b:0} },
            { name: "Tomato", hex: 0xFF6347, rgb: {r:255, g:99, b:71} },
            { name: "Coral", hex: 0xFF7F50, rgb: {r:255, g:127, b:80} },
            { name: "DarkOrange", hex: 0xFF8C00, rgb: {r:255, g:140, b:0} },
            { name: "Orange", hex: 0xFFA500, rgb: {r:255, g:165, b:0} },
            
            { name: "Yellow", hex: 0xFFFF00, rgb: {r:255, g:255, b:0} },
            { name: "LightYellow", hex: 0xFFFFE0, rgb: {r:255, g:255, b:224} },
            { name: "LemonChiffon", hex: 0xFFFACD, rgb: {r:255, g:250, b:205} },
            { name: "LightGoldenrodYellow", hex: 0xFAFAD2, rgb: {r:250, g:250, b:210} },
            { name: "PapayaWhip", hex: 0xFFEFD5, rgb: {r:255, g:239, b:213} },
            { name: "Moccasin", hex: 0xFFE4B5, rgb: {r:255, g:228, b:181} },
            { name: "PeachPuff", hex: 0xFFDAB9, rgb: {r:255, g:218, b:185} },
            { name: "PaleGoldenrod", hex: 0xEEE8AA, rgb: {r:238, g:232, b:170} },
            { name: "Khaki", hex: 0xF0E68C, rgb: {r:240, g:230, b:140} },
            { name: "DarkKhaki", hex: 0xBDB76B, rgb: {r:189, g:183, b:107} },
            { name: "Gold", hex: 0xFFD700, rgb: {r:255, g:215, b:0} },
            
            { name: "Cornsilk", hex: 0xFFF8DC, rgb: {r:255, g:248, b:220} },
            { name: "BlanchedAlmond", hex: 0xFFEBCD, rgb: {r:255, g:235, b:205} },
            { name: "Bisque", hex: 0xFFE4C4, rgb: {r:255, g:228, b:196} },
            { name: "NavajoWhite", hex: 0xFFDEAD, rgb: {r:255, g:222, b:173} },
            { name: "Wheat", hex: 0xF5DEB3, rgb: {r:245, g:222, b:179} },
            { name: "BurlyWood", hex: 0xDEB887, rgb: {r:222, g:184, b:135} },
            { name: "Tan", hex: 0xD2B48C, rgb: {r:210, g:180, b:140} },
            { name: "RosyBrown", hex: 0xBC8F8F, rgb: {r:188, g:143, b:143} },
            { name: "SandyBrown", hex: 0xF4A460, rgb: {r:244, g:164, b:96} },
            { name: "Goldenrod", hex: 0xDAA520, rgb: {r:218, g:165, b:32} },
            { name: "DarkGoldenrod", hex: 0xB8860B, rgb: {r:184, g:134, b:11} },
            { name: "Peru", hex: 0xCD853F, rgb: {r:205, g:133, b:63} },
            { name: "Chocolate", hex: 0xD2691E, rgb: {r:210, g:105, b:30} },
            { name: "SaddleBrown", hex: 0x8B4513, rgb: {r:139, g:69, b:19} },
            { name: "Sienna", hex: 0xA0522D, rgb: {r:160, g:82, b:45} },
            { name: "Brown", hex: 0xA52A2A, rgb: {r:165, g:42, b:42} },
            { name: "Maroon", hex: 0x800000, rgb: {r:128, g:0, b:0} },
            
            { name: "DarkOliveGreen", hex: 0x556B2F, rgb: {r:85, g:107, b:47} },
            { name: "Olive", hex: 0x808000, rgb: {r:128, g:128, b:0} },
            { name: "OliveDrab", hex: 0x6B8E23, rgb: {r:107, g:142, b:35} },
            { name: "YellowGreen", hex: 0x9ACD32, rgb: {r:154, g:205, b:50} },
            { name: "LimeGreen", hex: 0x32CD32, rgb: {r:50, g:205, b:50} },
            { name: "Lime", hex: 0x00FF00, rgb: {r:0, g:255, b:0} },
            { name: "LawnGreen", hex: 0x7CFC00, rgb: {r:124, g:252, b:0} },
            { name: "Chartreuse", hex: 0x7FFF00, rgb: {r:127, g:255, b:0} },
            { name: "GreenYellow", hex: 0xADFF2F, rgb: {r:173, g:255, b:47} },
            { name: "SpringGreen", hex: 0x00FF7F, rgb: {r:0, g:255, b:127} },
            { name: "MediumSpringGreen", hex: 0x00FA9A, rgb: {r:0, g:250, b:154} },
            { name: "LightGreen", hex: 0x90EE90, rgb: {r:144, g:238, b:144} },
            { name: "PaleGreen", hex: 0x98FB98, rgb: {r:152, g:251, b:152} },
            { name: "DarkSeaGreen", hex: 0x8FBC8F, rgb: {r:143, g:188, b:143} },
            { name: "MediumAquamarine", hex: 0x66CDAA, rgb: {r:102, g:205, b:170} },
            { name: "MediumSeaGreen", hex: 0x3CB371, rgb: {r:60, g:179, b:113} },
            { name: "SeaGreen", hex: 0x2E8B57, rgb: {r:46, g:139, b:87} },
            { name: "ForestGreen", hex: 0x228B22, rgb: {r:34, g:139, b:34} },
            { name: "Green", hex: 0x008000, rgb: {r:0, g:128, b:0} },
            { name: "DarkGreen", hex: 0x006400, rgb: {r:0, g:100, b:0} },
            
            { name: "Aqua", hex: 0x00FFFF, rgb: {r:0, g:255, b:255} },
            { name: "Cyan", hex: 0x00FFFF, rgb: {r:0, g:255, b:255} },
            { name: "LightCyan", hex: 0xE0FFFF, rgb: {r:224, g:255, b:255} },
            { name: "PaleTurquoise", hex: 0xAFEEEE, rgb: {r:175, g:238, b:238} },
            { name: "Aquamarine", hex: 0x7FFFD4, rgb: {r:127, g:255, b:212} },
            { name: "Turquoise", hex: 0x40E0D0, rgb: {r:64, g:224, b:208} },
            { name: "MediumTurquoise", hex: 0x48D1CC, rgb: {r:72, g:209, b:204} },
            { name: "DarkTurquoise", hex: 0x00CED1, rgb: {r:0, g:206, b:209} },
            { name: "LightSeaGreen", hex: 0x20B2AA, rgb: {r:32, g:178, b:170} },
            { name: "CadetBlue", hex: 0x5F9EA0, rgb: {r:95, g:158, b:160} },
            { name: "DarkCyan", hex: 0x008B8B, rgb: {r:0, g:139, b:139} },
            { name: "Teal", hex: 0x008080, rgb: {r:0, g:128, b:128} },
            
            { name: "LightSteelBlue", hex: 0xB0C4DE, rgb: {r:176, g:196, b:222} },
            { name: "PowderBlue", hex: 0xB0E0E6, rgb: {r:176, g:224, b:230} },
            { name: "LightBlue", hex: 0xADD8E6, rgb: {r:173, g:216, b:230} },
            { name: "SkyBlue", hex: 0x87CEEB, rgb: {r:135, g:206, b:235} },
            { name: "LightSkyBlue", hex: 0x87CEFA, rgb: {r:135, g:206, b:250} },
            { name: "DeepSkyBlue", hex: 0x00BFFF, rgb: {r:0, g:191, b:255} },
            { name: "DodgerBlue", hex: 0x1E90FF, rgb: {r:30, g:144, b:255} },
            { name: "CornflowerBlue", hex: 0x6495ED, rgb: {r:100, g:149, b:237} },
            { name: "SteelBlue", hex: 0x4682B4, rgb: {r:70, g:130, b:180} },
            { name: "RoyalBlue", hex: 0x4169E1, rgb: {r:65, g:105, b:225} },
            { name: "Blue", hex: 0x0000FF, rgb: {r:0, g:0, b:255} },
            { name: "MediumBlue", hex: 0x0000CD, rgb: {r:0, g:0, b:205} },
            { name: "DarkBlue", hex: 0x00008B, rgb: {r:0, g:0, b:139} },
            { name: "Navy", hex: 0x000080, rgb: {r:0, g:0, b:128} },
            { name: "MidnightBlue", hex: 0x191970, rgb: {r:25, g:25, b:112} },
            
            { name: "Lavender", hex: 0xE6E6FA, rgb: {r:230, g:230, b:250} },
            { name: "Thistle", hex: 0xD8BFD8, rgb: {r:216, g:191, b:216} },
            { name: "Plum", hex: 0xDDA0DD, rgb: {r:221, g:160, b:221} },
            { name: "Violet", hex: 0xEE82EE, rgb: {r:238, g:130, b:238} },
            { name: "Orchid", hex: 0xDA70D6, rgb: {r:218, g:112, b:214} },
            { name: "Fuchsia", hex: 0xFF00FF, rgb: {r:255, g:0, b:255} },
            { name: "Magenta", hex: 0xFF00FF, rgb: {r:255, g:0, b:255} },
            { name: "MediumOrchid", hex: 0xBA55D3, rgb: {r:186, g:85, b:211} },
            { name: "MediumPurple", hex: 0x9370DB, rgb: {r:147, g:112, b:219} },
            { name: "BlueViolet", hex: 0x8A2BE2, rgb: {r:138, g:43, b:226} },
            { name: "DarkViolet", hex: 0x9400D3, rgb: {r:148, g:0, b:211} },
            { name: "DarkOrchid", hex: 0x9932CC, rgb: {r:153, g:50, b:204} },
            { name: "DarkMagenta", hex: 0x8B008B, rgb: {r:139, g:0, b:139} },
            { name: "Purple", hex: 0x800080, rgb: {r:128, g:0, b:128} },
            { name: "Indigo", hex: 0x4B0082, rgb: {r:75, g:0, b:130} },
            { name: "DarkSlateBlue", hex: 0x483D8B, rgb: {r:72, g:61, b:139} },
            { name: "SlateBlue", hex: 0x6A5ACD, rgb: {r:106, g:90, b:205} },
            { name: "MediumSlateBlue", hex: 0x7B68EE, rgb: {r:123, g:104, b:238} },
            
            { name: "White", hex: 0xFFFFFF, rgb: {r:255, g:255, b:255} },
            { name: "Snow", hex: 0xFFFAFA, rgb: {r:255, g:250, b:250} },
            { name: "Honeydew", hex: 0xF0FFF0, rgb: {r:240, g:255, b:240} },
            { name: "MintCream", hex: 0xF5FFFA, rgb: {r:245, g:255, b:250} },
            { name: "Azure", hex: 0xF0FFFF, rgb: {r:240, g:255, b:255} },
            { name: "AliceBlue", hex: 0xF0F8FF, rgb: {r:240, g:248, b:255} },
            { name: "GhostWhite", hex: 0xF8F8FF, rgb: {r:248, g:248, b:255} },
            { name: "WhiteSmoke", hex: 0xF5F5F5, rgb: {r:245, g:245, b:245} },
            { name: "Seashell", hex: 0xFFF5EE, rgb: {r:255, g:245, b:238} },
            { name: "Beige", hex: 0xF5F5DC, rgb: {r:245, g:245, b:220} },
            { name: "OldLace", hex: 0xFDF5E6, rgb: {r:253, g:245, b:230} },
            { name: "FloralWhite", hex: 0xFFFAF0, rgb: {r:255, g:250, b:240} },
            { name: "Ivory", hex: 0xFFFFF0, rgb: {r:255, g:255, b:240} },
            { name: "AntiqueWhite", hex: 0xFAEBD7, rgb: {r:250, g:235, b:215} },
            { name: "Linen", hex: 0xFAF0E6, rgb: {r:250, g:240, b:230} },
            { name: "LavenderBlush", hex: 0xFFF0F5, rgb: {r:255, g:240, b:245} },
            { name: "MistyRose", hex: 0xFFE4E1, rgb: {r:255, g:228, b:225} },
            
            { name: "Gainsboro", hex: 0xDCDCDC, rgb: {r:220, g:220, b:220} },
            { name: "LightGray", hex: 0xD3D3D3, rgb: {r:211, g:211, b:211} },
            { name: "Silver", hex: 0xC0C0C0, rgb: {r:192, g:192, b:192} },
            { name: "DarkGray", hex: 0xA9A9A9, rgb: {r:169, g:169, b:169} },
            { name: "Gray", hex: 0x808080, rgb: {r:128, g:128, b:128} },
            { name: "DimGray", hex: 0x696969, rgb: {r:105, g:105, b:105} },
            { name: "LightSlateGray", hex: 0x778899, rgb: {r:119, g:136, b:153} },
            { name: "SlateGray", hex: 0x708090, rgb: {r:112, g:128, b:144} },
            { name: "DarkSlateGray", hex: 0x2F4F4F, rgb: {r:47, g:79, b:79} },
            { name: "Black", hex: 0x000000, rgb: {r:0, g:0, b:0} }
        ]
    }
}

