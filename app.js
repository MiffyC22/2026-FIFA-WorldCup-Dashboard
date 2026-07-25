/******************************************************************
 * 2026 FIFA World Cup Dashboard V7 FINAL
 *
 * Part A
 *
 * 初始化
 * Excel讀取
 * Sheet管理
 ******************************************************************/

//==================================================
// 全域狀態
//==================================================

//==================================================
// V8 FINAL
// 全域狀態
//==================================================

const Dashboard = {


    // JSON資料

    fifaData:{},


    // 淘汰賽資料

    knockoutData:{},


    // 目前輪次

    currentRound:"32強",


};
async function loadJSONData(){


    try{


        console.log(
            "開始讀取 JSON..."
        );


        const response =
            await fetch(
                "data/knockout_data.json"
            );


        Dashboard.knockoutData =
            await response.json();



        console.log(
            "JSON資料:",
            Dashboard.knockoutData
        );


        initDashboard();


    }


    catch(error){


        console.error(
            "JSON讀取失敗:",
            error
        );


    }

}
//==================================================
// 清除所有 Chart
//==================================================

function clearChart(){


    if(

        Dashboard.chart &&

        typeof Dashboard.chart.destroy === "function"

    ){

        Dashboard.chart.destroy();

        Dashboard.chart=null;

    }



    if(

        window.mirrorChart &&

        typeof window.mirrorChart.destroy === "function"

    ){

        window.mirrorChart.destroy();

        window.mirrorChart=null;

    }



}



//==================================================
// 網頁啟動
//==================================================

window.addEventListener(

"load",

()=>{

    loadJSONData();

});

//==================================================
// V8 FINAL
// JSON資料讀取
//==================================================


async function loadJSON(){


    try{


        const filePath =
            "./data/knockout_data.json";



        console.log(

            "讀取JSON:",

            filePath

        );



        const response =

            await fetch(filePath);



        console.log(

            "JSON response:",

            response.status

        );



        Dashboard.knockoutData =

            await response.json();



        console.log(

            "JSON資料:",

            Dashboard.knockoutData

        );



        initDashboard();



    }


    catch(error){


        console.error(

            "JSON載入失敗:",

            error

        );


        alert(

            "JSON載入失敗，請確認 data/knockout_data.json"

        );


    }


}

//==================================================
// 初始化 Dashboard
//==================================================

function initDashboard(){

    Dashboard.currentSheet="32強";

    createSheetList();

    document

    .getElementById(

        "sheetSelect"

    )

    .value=

        Dashboard.currentSheet;

    loadTeams();

    bindEvents();

    drawRankingTable();

}

async function loadJSONData(){


    try{


        console.log(
            "開始讀取 JSON..."
        );


        const response =
            await fetch(
                "data/knockout_data.json"
            );


        Dashboard.knockoutData =
            await response.json();



        console.log(
            "JSON讀取完成:",
            Dashboard.knockoutData
        );

        //================================
        // JSON轉回原本V7資料格式
        //================================

        Dashboard.fifaData=[];



        Object.keys(
            Dashboard.knockoutData
        )
        .forEach(


            round=>{


                Dashboard.knockoutData[round]
                .forEach(


                    team=>{


                        team["輪次"]=round;


                        Dashboard.fifaData.push(
                            team
                        );


                    }

                );


            }


        );



        console.log(
            "整理後資料:",
            Dashboard.fifaData
        );



        initDashboard();



    }


    catch(error){


        console.error(
            "JSON讀取失敗:",
            error
        );


    }


}
//==================================================
// 建立 Sheet 選單
//==================================================

function createSheetList(){

    const select=document.getElementById("sheetSelect");

    select.innerHTML="";

    [

        "32強",

        "16強",

        "8強",

        "4強"

    ].forEach(stage=>{

        const option=document.createElement("option");

        option.value=stage;

        option.textContent=stage;

        select.appendChild(option);

    });

}

//==================================================
// 清除Chart
//==================================================

function changeSheet(){

    if(Dashboard.chart){

        Dashboard.chart.destroy();

        Dashboard.chart=null;

    }


    const select =

        document.getElementById(
            "sheetSelect"
        );


    Dashboard.currentSheet =

        select.value;



    clearChart();

    const oldChart =

        Chart.getChart("mirrorChart");


    if(oldChart){

        oldChart.destroy();

    }

    const teamA =

        document.getElementById(
            "teamA"
        );


    const teamB =

        document.getElementById(
            "teamB"
        );



    if(teamA){

        teamA.value="";

    }


    if(teamB){

        teamB.value="";

    }



    loadTeams();


    drawRankingTable();


}

//==================================================
// 取得目前Sheet資料
//==================================================

function getCurrentData(){

    return Dashboard.fifaData.filter(

    team=>

    team["輪次"]===Dashboard.currentSheet

    );

}
/******************************************************************
 * V7 FINAL
 *
 * Part B
 *
 * 國家選單
 * Excel欄位Mapping
 * 資料標準化
 ******************************************************************/

//==================================================
// 建立國家選單
//==================================================

function loadTeams(){

    const teamA =

        document.getElementById(
            "teamA"
        );

    const teamB =

        document.getElementById(
            "teamB"
        );

    if(!teamA || !teamB){

        console.error(
            "找不到國家選單"
        );

        return;

    }

    teamA.innerHTML =

        `<option value="">
        請選擇國家 A
        </option>`;

    teamB.innerHTML =

        `<option value="">
        請選擇國家 B
        </option>`;

    const teams =

        getCurrentData();

    const countries =

        [

            ...new Set(

                teams.map(
                    item=>item["國家"]
                )

            )

        ];

    countries.forEach(

        country=>{

            const optionA =

                document.createElement(
                    "option"
                );

            optionA.value =
                country;

            optionA.textContent =
                country;

            const optionB =

                optionA.cloneNode(true);

            teamA.appendChild(
                optionA
            );

            teamB.appendChild(
                optionB
            );

        }

    );

}

//==================================================
// 取得球隊資料
//==================================================

function getTeamData(country){

    const data =

        getCurrentData();

    return data.find(

        team=>

        team["國家"]===country

    );

}

//==================================================
// Excel欄位候選
//==================================================

const FIELD_MAP = {

    goal:[

        "正規+延長賽進球",

        "進球數",

        "平均進球"

    ],

    concede:[

        "正規+延長賽失球",

        "失球數",

        "平均失球"

    ],

    shots:[

        "射門數",

        "平均射門"

    ],

    shotsOnTarget:[

        "射正數",

        "平均射正"

    ],

    saves:[

        "守門員救球數",

        "平均救球"

    ],

    conversion:[

        "射門轉換率",

        "進球效率"

    ],

    accuracy:[

        "射正率"

    ],

    saveRate:[

        "守門成功率",

        "撲救成功率"

    ],

    goalDiff:[

        "每場淨勝球",

        "淨勝球"

    ],

    attackDefense:[

        "攻守戰力"

    ],

    qualify:[

        "晉級能力"

    ],

    power:[

        "綜合戰力"

    ]

};

//==================================================
// 找欄位
//==================================================

function findField(

    row,

    list

){

    for(
        let key of list
    ){

        if(

            Object.prototype.hasOwnProperty.call(

                row,

                key

            )

        ){

            return key;

        }

    }

    return null;

}

//==================================================
// 取得數值
//==================================================

function getNumber(

    row,

    list

){


    const field =

        findField(
            row,
            list
        );

    if(!field)
        return 0;

    let value =
        row[field];

    if(
        typeof value==="string"
    ){

        value =
            value.replace(
                "%",
                ""
            );

    }

    value =
        Number(value);

    return isNaN(value)
        ?
        0
        :
        value;

}

//==================================================
// Mirror Bar資料建立
//==================================================

//==================================================
// V8 FINAL
// Mirror Bar Data Engine
//==================================================


const SCALE_CONFIG={


    "正規+延長賽進球":10,

    "正規+延長賽失球":10,

    "射門數":30,

    "射正數":15,

    "守門員救球數":15,

    "平均進球":5,

    "平均失球":5,

    "射門轉換率":100,

    "射正率":100,

    "守門成功率":100,

    "每場淨勝球":5,

    "攻守戰力":100,

    "晉級能力":100,

    "綜合戰力":100


};



// 越低越好的項目

const REVERSE_FIELDS=[


    "正規+延長賽失球",

    "平均失球"


];




//--------------------------------------------------
// 百分比修正
//--------------------------------------------------

function normalizePercent(value){


    if(value<=1 && value>0){

        return value*100;

    }


    return value;


}




//==================================================
// V8 Final
//
// Mirror Bar 數值標準化
//
// 不同能力項目使用不同尺度
// 左右兩隊同能力保持同一水平線
//==================================================


function normalizeValue(

    value,

    field,

    teamA,

    teamB

){


    value=Number(value)||0;

    //================================
    // 百分比類
    //================================

    if(

        field.includes("率")

    ){

        // Excel可能是 0.3333
        // 或 33.33

        if(value <= 1){

            value *= 100;

    }


        return Math.min(

            value,

            100

        );

    }

    //================================
    // 戰力類
    //================================

    if(

        field === "攻守戰力" ||

        field === "晉級能力" ||

        field === "綜合戰力"

    ){


        const maxPower = Math.max(

            Number(teamA[field]) || 0,

            Number(teamB[field]) || 0,

            1

        );


        return (

            value /

            maxPower *

            90

        );

    }

    //================================
    // 一般數值類
    //================================


    const maxValue = Math.max(

        Math.abs(valueA),

        Math.abs(valueB),

        1

    );



    return (

        value /

        maxValue *

        90

    );


}

//--------------------------------------------------
// 建立 Mirror資料
//--------------------------------------------------

function buildChartData(

    teamA,

    teamB

){


    const labels = [

        "正規+延長賽進球",

        "正規+延長賽失球",

        "射門數",

        "射正數",

        "守門員救球數",

        "平均進球",

        "平均失球",

        "射門轉換率",

        "射正率",

        "守門成功率",

        "每場淨勝球",

        "攻守戰力",

        "晉級能力",

        "綜合戰力"

    ];

// 建立原始資料

const rawA = [];

const rawB = [];

labels.forEach(label=>{

    rawA.push(

        getNumber(

            teamA,

            [label]

        )

    );


    rawB.push(

        getNumber(

            teamB,

            [label]

        )

    );


});

//================================
// Mirror Bar 顯示資料
//================================

const BAR_SCALE = 100;


const chartA = [];

const chartB = [];



rawA.forEach(

    (valueA,index)=>{


        const valueB = rawB[index];


        const maxValue = Math.max(

            Math.abs(valueA),

            Math.abs(valueB),

            1

        );



        chartA.push(

            Math.round(

                Math.abs(valueA)

                /

                maxValue

                *

                BAR_SCALE

            )

        );



        chartB.push(

            Math.round(

                Math.abs(valueB)

                /

                maxValue

                *

                BAR_SCALE

            )

        );


    }

);

    return {


        labels,


        // 左邊 Mirror
        teamA:

            chartA.map(

                value=>-value

            ),



        // 右邊 Mirror
        teamB:


            chartB,



        rawA,


        rawB


    };


}


// C-4 Plugin

const mirrorValueLabelPlugin = {


    id:"mirrorValueLabelPlugin",


    afterDatasetsDraw(chart){


        const ctx = chart.ctx;


        ctx.save();



        chart.data.datasets.forEach(

            (dataset,datasetIndex)=>{


                const meta =

                    chart.getDatasetMeta(
                        datasetIndex
                    );



                meta.data.forEach(

                    (bar,index)=>{


                        const value =

                            dataset.rawData[index];


                        if(value===undefined)
                            return;



                        ctx.font =
                            "bold 12px Arial";


                        ctx.fillStyle =
                            "#222";


                        ctx.textBaseline =
                            "middle";


                        let x;



                        // 左側 A

                        if(datasetIndex===0){


                            x =
                                bar.x - 12;


                            ctx.textAlign =
                                "right";


                            if(
                                x <
                                chart.chartArea.left + 20
                            ){

                                x =
                                    bar.x + 12;


                                ctx.textAlign =
                                    "left";

                            }


                        }


                        // 右側 B

                        else{


                            x =
                                bar.x + 12;


                            ctx.textAlign =
                                "left";


                            if(
                                x >
                                chart.chartArea.right - 20
                            ){

                                x =
                                    bar.x - 12;


                                ctx.textAlign =
                                    "right";

                            }


                        }



                        ctx.strokeStyle =
                            "#fff";


                        ctx.lineWidth =
                            3;



                        ctx.strokeText(

                            value,

                            x,

                            bar.y

                        );



                        ctx.fillText(

                            value,

                            x,

                            bar.y

                        );


                    }

                );


            }

        );



        ctx.restore();


    }


};

//==================================================
// V8 FINAL
//
// Ultimate Mirror Bar Chart
//
// Chart.js 4.4.3
//==================================================
function compareAbility(

    field,

    a,

    b

){


    // 失球越少越好

    if(

        field.includes("失球")

    ){

        if(a<b)
            return "A";

        if(a>b)
            return "B";

        return "T";

    }



    // 一般能力越高越好

    if(a>b)
        return "A";


    if(a<b)
        return "B";


    return "T";


}

 function drawMirrorChart(

    teamA,

    teamB

){


    const chartData=

        buildChartData(

            teamA,

            teamB

        );


    // 清除上一張 Mirror Bar

    clearChart();



    // 保險：確認 canvas 上沒有殘留 Chart

    const oldChart =

        Chart.getChart("mirrorChart");


    if(oldChart){

        oldChart.destroy();

    }

    const totalA =

        Number(
            teamA["綜合戰力"]
    );


    const totalB =

        Number(
            teamB["綜合戰力"]
    );


    let teamAColor;
    let teamBColor;



    if(totalA > totalB){

        teamAColor="#E61D25";

        teamBColor="#2A398D";

    }

    else if(totalA < totalB){

    teamAColor="#2A398D";

    teamBColor="#E61D25";

    }

    else{

    teamAColor="#3CAC3B";

    teamBColor="#3CAC3B";

    };


//===============================
// 在這裡建立 colorA / colorB
//===============================
// 新增 compareAbility()
// 新增 colorA
// 新增 colorB

    const colorA = chartData.rawA.map(

    (value,index)=>{


    const result = compareAbility(

        chartData.labels[index],

        value,

        chartData.rawB[index]

    );


    if(result==="A")
        return "#E61D25";


    if(result==="B")
        return "#2A398D";


    return "#3CAC3B";


    }

);



    const colorB = chartData.rawB.map(

    (value,index)=>{


    const result = compareAbility(

        chartData.labels[index],

        value,

        chartData.rawA[index],

    );


    if(result==="A")
        return "#E61D25";


    if(result==="B")
        return "#2A398D";


    return "#3CAC3B";


}

);

    console.log(chartData);

    clearChart();



    const canvas=

        document.getElementById(

            "mirrorChart"

        );



    if(!canvas){

        console.error(

            "找不到 mirrorChart"

        );

        return;

    }



    const ctx=

        canvas.getContext(

            "2d"

        );


    //--------------------------------------------------
    // 依綜合戰力判定顏色
    //--------------------------------------------------

    const powerA=

        Number(

            teamA["綜合戰力"]

        );

    const powerB=

        Number(

            teamB["綜合戰力"]

        );


    Dashboard.chart=

    window.mirrorChart=

    new Chart(

        ctx,

        {

        type:"bar",

        data:{

            labels:

                chartData.labels,

        



            datasets:[

            {

                label:

                    teamA["國家"],


                data:

                    chartData.teamA,

                rawData:

                    chartData.rawA,

                backgroundColor:

                    colorA,

                borderRadius:6,


                barThickness:18,

                barPercentage:1,

                categoryPercentage:1

            },


            {

                label:

                    teamB["國家"],



                data:

                    chartData.teamB,

                rawData:
                    chartData.rawB,

                backgroundColor:

                    colorB,

                borderRadius:6,

                barThickness:18,

                barPercentage:1,

                categoryPercentage:1

            }

            ]

        },

        options:{

            indexAxis:"y",


            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:600

            },

            layout:{

                padding:{

                    left:45,

                    right:45,

                    top:15,

                    bottom:15

                }

            },

            scales:{

                x:{

                    min:-110,

                    max:110,

                    stacked:true,

                    ticks:{

                        display:false

                    }

                },

                y:{


                    stacked:true,


                    offset:true,


                    ticks:{


                        color:"#111",


                        font:{


                            size:12,


                            weight:"bold"


                        }


                    },


    grid:{


        display:false


    }


}

            },

                        plugins:{


                tooltip:{


                    enabled:true,


                    callbacks:{


                        label(context){


                            return (

                                context.dataset.label

                                +

                                " : "

                                +

                                context.dataset.rawData[

                                    context.dataIndex

                                ]

                            );


                        }


                    }


                },



                legend:{


                    position:"top",


                    align:"center",



                    labels:{


                        usePointStyle:true,


                        pointStyle:"circle",


                        padding:12,



                        font:{


                            size:15,


                            weight:"bold"


                        },



                        generateLabels(chart){



                            return [



                                {


                                    text:

                                        teamA["國家"],


                                    fillStyle:

                                        teamAColor,


                                    strokeStyle:

                                        teamAColor,


                                    pointStyle:

                                        "circle",


                                    lineWidth:0,


                                    hidden:false,


                                    datasetIndex:0


                                },

                                {


                                    text:

                                        teamB["國家"],


                                    fillStyle:

                                        teamBColor,


                                    strokeStyle:

                                        teamBColor,


                                    pointStyle:

                                        "circle",


                                    lineWidth:0,


                                    hidden:false,


                                    datasetIndex:1


                                }


                            ];


                        }


                    }


                }


            }


        },


        plugins:[

            mirrorValueLabelPlugin

        ]


    });


}

//==================================================
// 🏆 戰力排行榜
//==================================================

//==================================================
// V8 FINAL
//
// TOP10 Ranking Table
//
// Highlight Selected Teams
//==================================================


function drawRankingTable(){


    const data =

        getCurrentData();



    if(!data || data.length===0){

        return;

    }



    const tbody =

        document.querySelector(

            "#rankingTable tbody"

        );



    if(!tbody){

        console.error(

            "找不到 rankingTable tbody"

        );

        return;

    }



    tbody.innerHTML="";



    //--------------------------------------------------
    // 取得目前選取國家
    //--------------------------------------------------

    const selectA =

        document.getElementById(

            "teamA"

        )?.value;



    const selectB =

        document.getElementById(

            "teamB"

        )?.value;




    //--------------------------------------------------
    // TOP10排序
    //--------------------------------------------------

    const ranking =


        [...data]

        .sort(

            (a,b)=>{


                return (

                    Number(

                        b["綜合戰力"]

                    )

                    -

                    Number(

                        a["綜合戰力"]

                    )

                );


            }

        )


        .slice(0,10);





    //--------------------------------------------------
    // 建立表格
    //--------------------------------------------------

    ranking.forEach(

        (team,index)=>{



            const tr =

                document.createElement(

                    "tr"

                );




            //--------------------------------------------------
            // Highlight
            //--------------------------------------------------

            if(

                team["國家"]===selectA

                ||

                team["國家"]===selectB

            ){


                tr.style.backgroundColor=

                    "#FFF3BF";


                tr.style.fontWeight=

                    "bold";


            }






            let rank="";



            if(index===0){


                rank="🥇";


            }

            else if(index===1){


                rank="🥈";


            }

            else if(index===2){


                rank="🥉";


            }

            else{


                rank=index+1;


            }





            const power =

                Number(

                    team["綜合戰力"]

                );





            tr.innerHTML=



            `

            <td class="rank">

                ${rank}

            </td>


            <td>

                ${team["國家"]}

            </td>


            <td>

                ${

                    isNaN(power)

                    ?

                    "-"

                    :

                    power.toFixed(1)

                }


            </td>


            `;




            tbody.appendChild(

                tr

            );



        }


    );


}

//==================================================
// 球隊選擇事件
//==================================================

function compareTeams(){

    const selectA =

        document.getElementById(
            "teamA"
        );

    const selectB =

        document.getElementById(
            "teamB"
        );


    if(
        !selectA ||
        !selectB
    )
        return;

    const nameA =

        selectA.value;

    const nameB =

        selectB.value;

    if(
        !nameA ||
        !nameB
    ){

        clearChart();

        return;

    }

    const teamA =

        getTeamData(
            nameA
        );

    const teamB =

        getTeamData(
            nameB
        );

    console.log(
    "選取A:",
    teamA
    );

    console.log(
    "選取B:",
    teamB
    );

    if(
        !teamA ||
        !teamB
    ){
        console.error(
            "找不到球隊資料"
        );

        return;

    }

    drawRankingTable();

    drawMirrorChart(

        teamA,

        teamB

    );

}

//==================================================
// 綁定事件
//==================================================

function bindEvents(){

    document

    .getElementById(
        "teamA"
    )

    ?.addEventListener(

        "change",

        compareTeams

    );

    document

    .getElementById(
        "teamB"
    )

    ?.addEventListener(

        "change",

        compareTeams

    );

    document

    .getElementById(
        "sheetSelect"
    )

    ?.addEventListener(

        "change",

        changeSheet

    );

}

//==================================================
// 自動調整Chart高度
//==================================================

function resizeChart(){

    if(
        Dashboard.chart
    ){

        Dashboard.chart.resize();

    }

}

window.addEventListener(

"resize",

resizeChart

);