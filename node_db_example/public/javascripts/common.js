$(function() {
    //

});
var common = {
    ajax_req: function(url, type, datatype, data, func) {
        console.log("[ajax_req]");

        $.ajax({
            url: url,
            type: type,
            dataType: datatype,
            data: data,
            success: function(result) {
                func();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
            }
        });
    },
    reload_browse: function() {
        console.log("[reload_browse]");
        alert("[reload_browse]");
        location.reload();
    },
    empty_alert: function(data) {
        if (data == "") {
            alert("入力してください");
            return false;
        }
    }
}