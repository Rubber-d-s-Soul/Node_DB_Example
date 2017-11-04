$(function() {

    //追加ボタン
    $(conf.id.createbtn).on("click", function() {
        console.log("create_btn");
        var title = $(conf.id.createform).val();

        //
        common.empty_alert(title);

        var data = { "title": title };
        console.log(data);
        //ajax req
        var url = conf.ajaxUrl.create;
        var type = conf.type.post;
        var datatype = conf.datatype.json;
        var func = common.reload_browse;
        common.ajax_req(url, type, datatype, data, func);
    });


    //更新ボタン
    $(conf.id.updatebtn).on("click", function() {
        console.log("update_btn");
        //selectedのデータ
        var selector = '[name=updateDocName] option:selected'
        var rev = $(selector).val();
        var id = $(selector).attr('id');
        var newtitle = $(conf.id.updateform).val();

        common.empty_alert(newtitle);

        var data = { "_id": id, "_rev": rev, "title": newtitle };
        console.log(data);
        //ajax req
        var url = conf.ajaxUrl.update;
        var type = conf.type.post;
        var datatype = conf.datatype.json;
        var func = common.reload_browse;
        common.ajax_req(url, type, datatype, data, func);
    });

    //削除ボタン
    $(conf.id.deletebtn).on("click", function() {
        console.log("delete_btn");
        //selectedのデータ取得
        var selector = '[name=deleteDocName] option:selected'
        var rev = $(selector).val();
        var id = $(selector).attr('id');
        var data = { "_id": id, "_rev": rev };

        //ajax req
        var url = conf.ajaxUrl.delete;
        var type = conf.type.post;
        var datatype = conf.datatype.json;
        var func = common.reload_browse;
        common.ajax_req(url, type, datatype, data, func);
    });
});

var conf = {
    id: {
        createform: "#createDocForm",
        updateform: "#updateDocForm",
        createbtn: "#create_btn",
        updatebtn: "#update_btn",
        deletebtn: "#delete_btn"
    },
    ajaxUrl: {
        create: "/couchdb/createDoc",
        update: "/couchdb/updateDoc",
        delete: "/couchdb/deleteDoc"
    },
    type: {
        get: "GET",
        post: "POST"
    },
    datatype: {
        json: "json"
    }
}