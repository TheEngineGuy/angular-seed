'use strict';

var app = angular.module('myApp',[]);

app.directive('flotChart', function(){
    return{
      restrict: 'E',

      scope: {
        activeData:"=",
        activeClick: "&",
        activeTooltip: "&",
        activeOptions: "="
      },

      template: '<div class="demo-container-small" ><div id="flotholder" class="demo-placeholder"></div></div>',

      link: function(scope, elem, attrs){

        var chart = null,
          opts  = { };
        var placeholder=elem.find("#flotholder");
        var container=elem.find(".demo-container-small");
        var highlightMap={};
        var itemIndex;

        var curSelect=null;
          if(attrs.activeWidth){
              console.log("width:"  + attrs.activeWidth);
              container.css({'width' : attrs.activeWidth});
          }
        if(attrs.activeHeight)
            container.css({'height' : attrs.activeHeight});

//      $("#placeholder").bind("plotclick", function (event, pos, item) {
        placeholder.bind("plotclick", function (event, pos, item) {
          if (item) {
            //$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
            itemIndex=item.dataIndex;

            if(itemIndex==curSelect){
               return;
            }
            if(curSelect){
              var oldData=item.series.data[curSelect];
              //console.log('curSelect ' + curSelect + ' itemIndex: ' + itemIndex);
              //console.log('oldData' + oldData);
              chart.unhighlight(item.series, oldData);
//              chart.unhighlight();
            }
            chart.highlight(item.series, item.datapoint);
            curSelect=itemIndex;
            var x = item.datapoint[0].toFixed(2),
              y = item.datapoint[1].toFixed(2);
            var ret = scope.activeClick({x:x, y:y,sI: item.seriesIndex,dI:item.dataIndex});
          }
        });


        function showTooltip(x, y, contents) {
          $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y + 5,
            left: x + 5,
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
          }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        placeholder.bind("plothover", function (event, pos, item) {


          if (item) {
            //console.log("plothover over item");

            if (previousPoint != item.dataIndex) {

              previousPoint = item.dataIndex;

              $("#tooltip").remove();
              var x = item.datapoint[0].toFixed(2),
                y = item.datapoint[1].toFixed(2);

              var tooltip_str = item.series.data[item.dataIndex][2];

              if(!tooltip_str){
                //tooltip_str=item.series.label + " of " + x + " = " + y;
                tooltip_str=scope.activeTooltip({ x:x, y:y, sI: item.seriesIndex, dI:item.dataIndex});
              }
              showTooltip(item.pageX, item.pageY,tooltip_str);
//                item.series.label + " of " + x + " = " + y);
            }
          } else {
            $("#tooltip").remove();
            previousPoint = null;
          }

        });



        scope.$watch("activeData", function(v){
           console.log("flot controller directive started"); 
          if(!v) return;
          if(!v.start_data) return;
          if(!chart){
            if(v.start_data.length==0) return;
            //chart = $.plot("#placeholder", [
              console.log("plot:" + v.start_data.length);  
              chart = $.plot(placeholder, v.start_data, scope.activeOptions);

          }else{
            chart.setData(v);
            chart.setupGrid();
            chart.draw();
          }
        });
      }
    };
  });

app.controller('FlotChartController', function($scope) {
          $scope.chartData=[[1375056000000,131289],[1374969600000,172551],[1374883200000,172910],[1374796800000,172388],[1374710400000,172652],[1374624000000,172549],[1374537600000,173180],[1374451200000,172887],[1374364800000,173035],[1374278400000,172866],[1374192000000,172738],[1374105600000,172605],[1374019200000,172749],[1373932800000,172832],[1373846400000,172525],[1373760000000,172861],[1373673600000,172665],[1373587200000,172609],[1373500800000,173005],[1373414400000,172864],[1373328000000,172813],[1373241600000,172502],[1373155200000,172460],[1373068800000,172818],[1372982400000,172669],[1372896000000,172784],[1372809600000,173126],[1372723200000,172301],[1372636800000,172702],[1372550400000,32066]];


      $scope.indexChart={
        clickCallback: function (x,y,sI,dI){

          console.log("clickCallback: sI: " + sI + " dI: " + dI + " x: " + x + " y:" + y);
          return "customized x=" + x + " y="+y;
        },
        tooltipCallback:function (x,y,sI,dI){

          //console.log("clickCallback: sI: " + sI + " dI: " + dI + " x: " + x + " y:" + y);
          return "customized x=" + x + " y="+y;
        },

        chartOptions: {
          legend: {show: true},
          series: {
           // bars: {show: true, barWidth: 12*1000*3600}
            lines: {show: true}
            //points: {show: true}
          },
          yaxis: {ticks: 2},
          xaxis: {
            mode: "time",
            timezone: 'utc',
            tickLength: 5,
            minTickSize: [1, "day"]
          },
          selection: {
            mode: "x"
          },
          grid: {
            hoverable: true,
            clickable: true
          }
        },

        chartSeries : [
          {data:[], label:'indexes'}
        ],

        indexChartTrigger: {
           start_data: this.chartSeries,
           state:'init'
        },
        setData: function(di,data){
          this.chartSeries[di].data=data;
          this.indexChartTrigger={
            start_data: this.chartSeries,
            state:'init'
          };
        }

      };

      $scope.indexChart.setData(0,$scope.chartData);
      console.log("flot controller started");
});



