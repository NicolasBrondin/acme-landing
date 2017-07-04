var Home = { template: 
    `<div>
        <JumbotronSection></JumbotronSection> 
        <PresentationSection></PresentationSection>
        <ArticleSection></ArticleSection>
        <EmailSection></EmailSection>
    </div>`};

var Trainer = { template: 
    `<div><h1>Le post qui match ?</h1>
     <Tinder></Tinder></div>` };

var routes = {
    '/': Home,
    '/trainer': Trainer
};

var post_to_html = function(post){
    var html ="";
    return html;
};

function strip(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

var app = new Vue({
    el: '#Vue',
    data: {
        loaded: true,
        currentRoute: window.location.pathname
    },
    
      
    computed: {
        ViewComponent : function () {
          return routes[this.currentRoute] || Home
        }
      },
    components: [JumbotronSection, PresentationSection, ArticleSection, EmailSection],
    render: function (create_element) { return create_element(this.ViewComponent) }
});

