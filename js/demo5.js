var mySwiper = new Swiper ('.swiper-container', {
    pagination: {
            el: '.swiper-pagination',
        },
    initialSlide :2,
    speed:300,
    autoplay : {
        delay:3000
    },
})
var iscroll=new IScroll(".content", {
    mouseWheel: true,
    scrollbars: true,
    shrinkScrollbars:"scale",
    fadeScrollbars:true,
    click:true
});
var state="project";
//点击新增
$(".add").click(function () {
    $(".mask").show();
    $(".submit").show();
    $(".update").hide();
    $(".inputarea").transition({y:0},500);
});
$(".cancel").click(function () {
    $(".inputarea").transition({y:"-62vh"},500,function () {
        $(".mask").hide();
});
})
$(".submit").click(function () {
    var val=$("#text").val();
    $("#text").val("");
    var data=getData();
    var time=new Date().getTime();
    data.push({content:val,time,star:false,done:false});       //是否要标记的状态
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function () {
        $(".mask").hide();
    });
});
$(".project").click(function () {
    $(this).addClass("active").siblings().removeClass("active");     //sibling(s)兄弟元素
    state="project";
    render();
})
$(".done").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    state="done";
    render();
})
$(".update").click(function (){
    var val=$("#text").val();
    $("#text").val("");
    var data=getData();
    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function () {
        $(".mask").hide();
    });
})
$(".itemlist")
    .on("click",".changestate",function () {
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].done=true;
        saveData(data);
        render();
})
    .on("click",".del",function () {
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1);
        saveData(data);
        render();
    })
    .on("click","span",function () {
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].star=!data[index].star;
        saveData(data);
        render();
    })
    .on("click","p",function () {
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show().data("index",index);
    });
function getData() {
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data) {
    localStorage.todo=JSON.stringify(data);
}
function render() {
    var data=getData();
    var str="";
    data.forEach(function(val,index){
        if(state==="project"&&val.done===false){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">★</span><div class='changestate'>完成</div></li>"
        }else if(state==="done"&&val.done===true){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">★</span><div class='del'>删除</div></li>"
        }
    });
    $(".itemlist").html(str);
    iscroll.refresh();
    addTouchEvent();
}
render();
function parseTime(time){
    var date=new Date();
    date.setTime(time);
    var year=date.getFullYear();
    var month=setZero(date.getMonth()+1);
    var day=setZero(date.getDate());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var sec=setZero(date.getSeconds());
    return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+sec;
}
function  setZero(n) {
    //如果n<就返回“0”+n，否则返回n
    return n<10?"0"+n:n;
}
// $("").each(function () {
//
// })
function addTouchEvent() {
    $(".itemlist>li").each(function (index,ele) {
        let hammerobj=new Hammer(ele);
        let sx,movex;
        //movex当前这一次触摸移动的位置 这里计算的是移动的delete框占1/5
        let max=window.innerWidth/5;
        let state="start";
        let flag=true;          //手指离开之后要不要有动画
        hammerobj.on("panstart",function(e){
            ele.style.transition="none";
            sx=e.center.x;
        })
        hammerobj.on("panmove",function(e){
            let cx=e.center.x;
            movex=cx-sx;
            if(movex>0&&state==="start"){
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){
                flag=false;
                return;
            }
            //能走的时候不走多
            if(Math.abs(movex)>max){
                flag=false;
                state=state==="start"?"end":"start";
                if(state==="end"){
                    $(ele).css("x",-max);
                }else{
                    $(ele).css("x",0);
                }
                return;
            }
            if(state==="end"){
                movex=-max+cx-sx;
            }
            flag=true;
            $(ele).css("x",movex);
            // }
        });
        hammerobj.on("panend",function(e){
            if(!flag)return;
            ele.style.transition="all .5s";
            if(Math.abs(movex)<max/2){
                $(ele).transition({x:0});
                // ele.style.transform="translateX(0)";
                state==="start";
            }else{
                $(ele).transition({x:-max});
                // ele.style.transform=`translateX(${-max}px)`;
                state==="end";
            }
        })
    })
}
