$.fn.extend({
    totop:function () {
        this.click(function () {
            $("html,body").animate({scrollTop:0},500);
        })
    }
});