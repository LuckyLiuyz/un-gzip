
//压缩编码
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";


//解压编码
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
    63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32,
    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51, -1, -1, -1, -1, -1);

/**
 * @method 解压缩 
 */
function unzip() {
    try{
        document.getElementById("target-code").innerHTML = "";
        var str = document.getElementById("origin-code").value;
        if (str == undefined) {
            return null;
        }
        var gstr = decodeBase64(str);
        var strData = pako.inflate(gstr, {
            to : 'string'
        });
        try{
            strData = JSON.parse(strData);
        }catch(error){

        }
        if (strData.error && strData.error.stack) {
            var stack = strData.error.stack;
            stack = stack.replace(/\r\n/g, '<br>');
            stack = stack.replace(/\t/g, '               ');
            strData.error.stack = stack;
        }
        console.log("解压结果：", strData);
        strData = JSON.stringify(strData, null, 4)
        document.getElementById("target-code").innerText = strData;
    }catch (error){
        document.getElementById("target-code").innerText = "解压出现异常====>" + error;
    }
};

/**
 * @method 压缩 
 */
function zip() {
    try{
        document.getElementById("target-code").innerText = "";
        var str = document.getElementById("origin-code").value;
        if (str == undefined) {
            return null;
        }
        var gstr2 = pako.gzip(str);
        gstr2 = encodeBase64(gstr2)
        document.getElementById("target-code").innerText = gstr2;
    }catch(error){
        document.getElementById("target-code").innerText = "压缩出现异常====>" + error;
    }
}

/**
 * @method 压缩 
 */
function encodeBase64(bytes) {
    var out, i, len;
    var c1, c2, c3;
    len = bytes.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = bytes[i++] & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = bytes[i++];
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = bytes[i++];
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};

/**
 * @method 解压缩 
 */
function decodeBase64(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
};