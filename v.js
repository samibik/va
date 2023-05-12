var ct = 89; //hiển thị 89 text đầu tiên
var arrLocal = [];
//console.log("localStorage: ", localStorage);
//var dataStorge = ;
var firstText = "صانع الإسم بالخط العربي";
var forwardText = forward(firstText);
var clipboard = new ClipboardJS('.copybutton');
try {
    if (localStorage != null && localStorage.mydata != null) {
        arrLocal = $.parseJSON(localStorage.mydata);
    }
} catch(e){
    console.log("Ở ẩn danh không hỗ trợ localStorage: " , e);
}

//lấy dữ liệu sử dụng gần đây nhất
var getHistory = function () {
    if (arrLocal != null && arrLocal.length > 0) {
        $("div#history").append("<h4>الأحدث</h4>");
        for (var i = 0; i < arrLocal.length; i++) {
            var item = arrLocal[i];
            $("div#result .copybutton[data-clipboard-target='" + item.Id + "']").remove();
            //var id = item.Id.replace("#copy_", "");
            //var customId = 1000 + parseInt(id);

            //$(item.Id).parent().remove();
            var _divGr = $("<div class='input-group mb-3 copybutton' data-clipboard-action='copy' data-clipboard-target='" + item.Id + "'></div>");
            _divGr.append(item.Value);
            $("div#history").append(_divGr);
            $(".input-group-append span").text("نسخ");
            //$("div#history input[id='" + item.Id.replace("#", "") + "']").attr("id", "copy_" + customId);
            //$("div#history span[data-clipboard-target='" + item.Id + "']").attr("data-clipboard-target", "#copy_" + customId);
            console.log("item.Id ", item.Id);
        }

    }
};
//setup dữ liệu đầu tiên         
var firstData = function () {
    var arrFirstResult = forwardText.split('\n\n');
    for (var i = 0; i < 89; i++) {
        var _divGr = $("<div data-type='div' class='input-group mb-3 copybutton' data-clipboard-action='copy' data-clipboard-target='#copy_" + i + "'></div>");
        //_divGr.append("<span style='width:24px;'>" + i + "</span>");
        var a = i + 1;
        var _input = $("<input type='text' class='form-control text-" + a + "' id='copy_" + i + "' readonly='readonly' />")
        _input.attr("value", arrFirstResult[i]);
        _divGr.append(_input);
        //action
        var _div_action = $("<div class='input-group-append'></div>")
        var span_action = $("<span data-type='button' class='input-group-text copybutton' data-clipboard-action='copy' data-clipboard-target='#copy_" + i + "'></span>").text("نسخ");
        _div_action.append(span_action)
        //
        _divGr.append(_div_action);
        
        $("div#result").append(_divGr);
    }
    getHistory();
};

$(function () {
    firstData(); //call để lấy dữ liệu đầu tiên
    $(".fancytext").keyup(function () {
        var value = $(this).val();
        $(this).attr("value", value);      
        if ($.trim(value) != '') {
            generateFancy(value);
        } else {
            generateFancy(firstText);
        }
    });

    $(".loadmore").click(function () {
        window.parent.postMessage({
            sentinel: 'amp',
            type: 'embed-size',
            height: document.body.scrollHeight,
            href: window.location.href
        }, "*");
        $(this).html('Đang tải...');
        var text = $.trim($(".fancytext").val());
        if (text == '') {
            text = 'Preview Text';
        }
        var that = $(this);
        var intvl = setInterval(function () { that.html('المزيد...'); clearInterval(intvl); }, 1000);
        for (var i = 1; i <= 10; i++) {
            var _divGr = $("<div data-type='div' class='input-group mb-3 copybutton' data-clipboard-action='copy' data-clipboard-target='#copy_" + ct + "'></div>");
            var _input = $("<input type='text' class='form-control' id='copy_" + ct + "' readonly='readonly' />")
            _input.attr("value", crazyWithFlourishOrSymbols(text));
            _divGr.append(_input);
            //action
            var _div_action = $("<div class='input-group-append'></div>")
            var span_action = $("<span data-type='button' class='input-group-text copybutton' data-clipboard-action='copy' data-clipboard-target='#copy_" + ct + "'></span>").text("نسخ");
            _div_action.append(span_action)
            _divGr.append(_div_action);
            //
            ct++;
            $("div#result").append(_divGr);
        }
    });
    //copy
   
    $("body").on("click", ".copybutton", function () {
        var idparent = $(this).parent().attr("id");
        var dataType = $(this).attr("data-type");
        var id = $(this).attr("data-clipboard-target");
        if (dataType != null && dataType == "button") {
            $(".input-group-append span").text("نسخ");
            $(this).text("نسخ");
        }

        if (idparent == "history") return;// không xử lý nếu đã lưu local
        
        var arr = arrLocal.filter(item => item.Id == id);
        
        if (arr.length > 0) return;// không xử lý nếu đã lưu local
        var html = dataType != null && dataType == "button" ? $(this).parent().parent().html() : $(this).html();

        var data = {
            "Id": id,
            "Value": html,
        };
        arrLocal.unshift(data);
        arrLocal.splice(3, arrLocal.length - 1);
        localStorage.mydata = JSON.stringify(arrLocal);
    });
    clipboard.on('success', function (e) {
        //console.log(e);
        //console.log("copirrrr: ", e);
        $("#snackbar").text("نسخ: " + e.text);
        $("#snackbar").attr("class", "show");
        setTimeout(function () {
            $("#snackbar").removeAttr("class");
        }, 3000);


    });
    clipboard.on('error', function (e) {
        //console.log(e);
    });
});
