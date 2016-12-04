(function (window,$) {
    "use strict";
    Storage.prototype.getItem = (function(key) {
        return JSON.parse(this.call(localStorage,key));
    }).bind(Storage.prototype.getItem);

    Storage.prototype.setItem = (function(key, value) {
        this.call(localStorage, key, JSON.stringify(value));
    }).bind(Storage.prototype.setItem);

    // Genereerib vastavad DOM elemendid
    function createCommentList(comments) {
        $.each(comments, function(index, item){
            addCommentToList(item);
        });
    }

    // Uuenduse järel tulevad kommentaarid lisada olemasoleva külge
    // Eeldus, et dokument on valmis
    function addCommentToList(item) {
        var comment = document.createElement("div");
        $(comment).append('<span>'+item.name+'</span><br>');
        if(item.email){
            $(comment).append('<span>'+item.email+'</span><br>');
        }
        $(comment).append('<p>'+item.comment+'</p>');
        var commentDate = new Date(item.createdDate);
        $(comment).append('<button type="button">Vasta</button><span style="float:right">'+commentDate.toLocaleString()+'</span>');
        $(comment).find('button').on('click', function(e){
            insertQuote(item.comment);
        });
        $('#comments').prepend(comment);
    }

    // Kommentaarile vastamine
    function insertQuote(comment) {
        window.scrollTo(0,0);
        $('#comment').val("\""+comment+"\"\n");
        $('#comment').focus();
    }

    $(window.document).ready(function() {
        var comments = [];
        // Kui on eelnevalt külastatud kuva kohe
        // ilma uuendust ootamata
        // LocalStorage mahutab tavaliselt vaikimisi brauserites kuni 10MB
        if (localStorage.getItem("comment")) {
            comments = localStorage.getItem("comment");
            createCommentList(comments);
        }
        // Tavaline ajax poll. Long-poll ja websocket oleks liig külalisteraamatu jaoks minu arust
        // Uuendus iga minuti tagant
        setInterval(function(){
                $.ajax({
                    url: "/comment",
                    success: function(data){
                        if(data._embedded.comment.length != comments.length || !(data._embedded.comment.length > 0)) {
                            if(data._embedded.comment.length > 0) {
                                localStorage.setItem("comment", data._embedded.comment);
                                console.log(data);
                                $.each(data._embedded.comment, function(index, item) {
                                    if(data._embedded.comment[index] !== comments[index]){
                                        comments.push(item);
                                        addCommentToList(item);
                                    }
                                });
                            } else {
                                localStorage.removeItem("comment");
                            }
                        }
                    },
                    dataType: "json"
                });
        }, 60000);
        $('#postComment').submit(function(e){
            e.preventDefault();
            var temp = {};
            temp.name = $.trim($('#name').val());
            temp.comment = $.trim($('#comment').val());
            if($('#email').val()) {
                temp.email = $.trim($('#email').val());
            }

            $.ajax({
                type: "POST",
                url: "/comment",
                data: JSON.stringify(temp),
                contentType: "application/json",
                success: function(data){
                    comments.push(data);
                    localStorage.setItem("comment", comments);
                    addCommentToList(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                    alert("Tekkis viga salvestamisel!");
                },
                dataType: "json",
            });
        })
    });
})(window,Zepto);