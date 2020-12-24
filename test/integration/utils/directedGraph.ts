export function getDirectedGraph(data: analyseData, idData: nameToId): string {
    data = data.map(direction => {
        const newData: [Record<string, unknown>, Record<string, unknown>, string | number, number, string] = [
            {},
            {},
            0,
            0,
            ""
        ];
        // 起点分类对应名称，终点分类对应名称，值，游戏时间，房间名
        // 根据1.type分类，2.建筑名称分类
        for (const id in idData) {
            for (let i = 0; i < 2; i++) {
                if (direction[i] === id) {
                    newData[i] = idData[id].type;
                    if (!newData[4]) {
                        if (typeof idData[id].room === "string") {
                            newData[4] = idData[id].room as string;
                        } else {
                            (idData[id].room as roomPosData[]).forEach((pos, index, array) => {
                                if (
                                    index - 1 >= 0 &&
                                    direction[3] > array[index - 1].gameTime &&
                                    direction[3] < array[index].gameTime
                                ) {
                                    newData[4] = pos.room;
                                }
                            });
                        }
                    }
                }
            }
            if (Object.keys(newData[0]).length !== 0 && Object.keys(newData[1]).length !== 0 && newData[4] !== "") {
                newData[2] = direction[2];
                newData[3] = direction[3];
                return newData;
            }
        }
        console.log("id没有对应名称");
        return direction;
    }) as analyseData;
    return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf8"></meta>
    <script src="http://cdn.bootcss.com/echarts/5.0.0/echarts.js"></script>
    <script src="http://lib.sinaapp.com/js/jquery/1.10.2/jquery-1.10.2.min.js"></script>
    <script type="text/javascript">
        function draw(){
            var text = $("#graph-input").val();
            var data = eval(text);
            var graph = data2Graph(data);
            drawGraph(graph);
        }

        function data2Graph(data) {
            var graph = {}
            var vertices = {}
            var links = [];
            let state = false;
            for (var i = 0; i < data.length; i++) {
                var sRec = data[i][0];
                var tRec = data[i][1];
                let s = String(data[i][0].namedType)
                let t = String(data[i][1].namedType)
                var v = Number(data[i][2]);
                if(!vertices[s]){
                    vertices[s] = {name: s, value: -v};
                }else{
                    vertices[s]["value"] -= v;
                }
                if(!vertices[t]){
                    vertices[t] = {name: t, value: v};
                }else{
                    vertices[t]["value"] += v;
                }
                if(links.map((link)=>{
                    if(link.source === s && link.target === t){
                        link.value += v;
                        state = true;
                    }
                    return link;
                }))
                if(state == true){
                    state = false;
                    continue;
                }
                links.push({'source' : s, 'target' : t, 'value' : v});
            }
            var colors=['rgb(255,63,93)','rgb(243,158,121)','rgb(180,60,153)','rgb(140,164,220)','rgb(130,208,255)']
            var nodes = [];
            let maxValue = 0;
            $.each(vertices, function(k, v) {
                if(maxValue<Math.abs(v.value))maxValue=Math.abs(v.value);
            });
            $.each(vertices, function(k, v) {
                let maxValueDigit = Math.log10(maxValue)
                let valueDigit = Math.log10(Math.abs(v.value))
                let statusNum = Math.log10(maxValue)-Math.log10(Math.abs(v.value))
                let symbolSize = statusNum<3?Math.round((6-statusNum)*50):150;
                let color = "";
                if(statusNum<3 && v.value>0)color=colors[1]
                if(statusNum<3 && v.value<0)color=colors[3]
                if(statusNum<1.5 && v.value>0)color=colors[0]
                if(statusNum<1.5 && v.value<0)color=colors[4]
                if(statusNum>3)color=colors[2]
                nodes.push({'name' : v.name, 'value' : v.name+":"+v.value,
                "symbolSize":symbolSize,
                'itemStyle':{'color':color}});
            });
            graph['links'] = links;
            graph['data'] = nodes;
            graph['maxValue'] = maxValue;
            return graph;
        }

        function drawGraph(graph) {
            var myChart = echarts.init(document.getElementById("echarts-main"));
            const myTextStyle = {
                color: "#333", //文字颜色
                fontStyle: "normal", //italic斜体  oblique倾斜
                fontWeight: "normal", //文字粗细bold   bolder   lighter  100 | 200 | 300 | 400...
                fontFamily: "sans-serif", //字体系列
                fontSize: 16 //字体大小
            };
            const myEdgeLabelTextStyle = {
                color: "#333", //文字颜色
                fontStyle: "normal", //italic斜体  oblique倾斜
                fontWeight: "normal", //文字粗细bold   bolder   lighter  100 | 200 | 300 | 400...
                fontFamily: "sans-serif", //字体系列
                fontSize: 13 //字体大小
            };
            const myEdgeLabel = {
                show: true, //是否显示标签。
                position: 'middle', //标签的位置。// 'start' 线的起始点。'middle' 线的中点。'end' 线的结束点。

                // offset: [-50, -50], //是否对文字进行偏移。默认不偏移。例如：[30, 40] 表示文字在横向上偏移 30，纵向上偏移 40。
                formatter: "{c}", //标签内容格式器。模板变量有 {a}、{b}、{c}，分别表示系列名，数据名，数据值。
                textStyle: myEdgeLabelTextStyle
            };
            const myLabel = {
                show: true, //是否显示标签。
                position: "inside", //标签的位置。// 绝对的像素值[10, 10],// 相对的百分比['50%', '50%'].'top','left','right','bottom','inside','insideLeft','insideRight','insideTop','insideBottom','insideTopLeft','insideBottomLeft','insideTopRight','insideBottomRight'
                // offset: [50, 50], //是否对文字进行偏移。默认不偏移。例如：[30, 40] 表示文字在横向上偏移 30，纵向上偏移 40。
                formatter: function (e) {
                                    return e['data']['value'];
                                },
                textStyle: myTextStyle
            };
            var option = {
                tooltip: {
                    trigger: 'item',
                },
                series : [
                    {
                        type: 'graph',
                        layout: 'force',
                        draggable: true,
                        edgeSymbol: ['none', 'arrow'],
                        symbolSize: 150,
                        data: graph.data,
                        links: graph.links,
                        roam: true,
                        label: {
                            normal: myLabel,
                            emphasis: myLabel
                        },
                        edgeLabel: {
                                    // 显示线中间的标签
                                    show: true,
                                    normal: myEdgeLabel,
                                    emphasis: myEdgeLabel
                        },
                        force: {
                            repulsion: 10000,
                            edgeLength: 700
                        },
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 2,
                                curveness: 0.2
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
        }

        $(document).ready(function(){
            draw();
            $("#gen-btn").on("click", function(){
                draw();
            });
        });
    </script>
    </head>
    <body>
    <div id="echarts-main" style="height:1080px;width:1920px;border:1px dashed;"></div>
    <p>在下方文本框内输入有向图JSON（[source, target, value]）：</p>
    <textarea id="graph-input" style="height:210px;width:500px">
    ${JSON.stringify(data).toString()}
    </textarea>
    <p><button id="gen-btn">生成有向图</button></p>
    </body>
    </html>
    `;
}
