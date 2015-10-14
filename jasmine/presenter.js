function SimpleHtmlPresenter(renderNodeSelection){
    this.render = function(result){
        var div = $('<div></div>');
        div.html(JSON.stringify(result));
        renderNodeSelection.append(div);
    };
}

function HandlebarsPresenter(renderNodeSelection, template){
    var source   = template.html();
    var template = Handlebars.compile(source);
    this.render = function(result){
        var div = $('<div></div>');
        div.html(template(result));
        renderNodeSelection.append(div);
    };
}