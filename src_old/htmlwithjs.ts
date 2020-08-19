/*
'<!DOCTYPE html>\
<html>\
<head>\
<meta charset="utf-8">\
<title>菜鸟教程(runoob.com)</title>\
</head>\
<body>\
<b>这个文本是加粗</b>\
<br />\
<strong>这个文本是加粗的</strong>\
<br />\
<big>这个文本字体放大</big>\
<br />\
<em>这个文本是斜体的</em>\
<br />\
<i>这个文本是斜体的</i>\
<br />\
<small>这个文本是缩小的</small>\
<br />\
这个文本包含\
<sub>下标</sub>\
<br />\
这个文本包含\
<sup>上标</sup>\
</body>\
</html>'
*/
{
    let htmj = {
        set: function (stringIn) {
            let a = '<!DOCTYPE html><html>';
            let b = '</html>';
            let stringOut = a + stringIn + b;
            Memory.consoleTest.x = stringOut;
        },

        head: function (stringIn, title) {
            let a = '<head><meta charset="utf-8"><title>' + title + '</title></head>';
            let stringOut = a + stringIn;
            Memory.consoleTest.x = stringOut;
        },

        body: function (stringIn) {
            let a = '<body>' + stringIn + '</body>';
            Memory.consoleTest.x = a;
        },

        css: function (stringIn) {
            let a = '<style type="text/css">\
        h1{color:red;}\
        p{\
            color:black;\
            font-family:"Times New Roman";\
            font-size:20px;\
            background-color:##99ccff;\
        }\
        </style>'+ stringIn;
            Memory.consoleTest.x = a;
        },

        meset: function (stringIn, title) {
            if (!Memory.consoleTest) {
                Memory.consoleTest = {
                    x: ''
                };
            }
            this.body(stringIn);
            this.head(Memory.consoleTest.x, title);
            this.css(Memory.consoleTest.x);
            this.set(Memory.consoleTest.x);
        }
    }

    module.exports = htmj;
}