(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-100592263-1', 'auto');
  ga('send', 'pageview');
window.$crisp=[];window.CRISP_WEBSITE_ID="e695ada8-1d7d-4dbf-a432-d4f99eedde68";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.im/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
var Article = Vue.component('Article',{
    template : `<article v-if="article" v-bind:class="{dragging: dragging}" v-on:click="drag()" v-on:mousedown="pick_element()"  v-on:touchstart="pick_element()"> <header> <div style="display: block;width: 50px;float: left;"> <img src="img/profile.png" style="width:50px;" alt="profile pic"/> </div><div style="display: block;width: calc(100% - 100px);padding-top: 10px;float: left;padding-left: 10px;padding-bottom: 7px;"> <p style="color: rgb(54, 88, 153);font-weight: bold;margin-top: -6px;">ACME</p><p style="color: grey;font-size: 14px;">il y a 1 minute</p></div></header> <div class="user-text"> <p style="white-space: pre-line;">{{article.user_text}}</p></div><div class="media-info"> <div class="media-image"> <img v-bind:src="article.media.visual.url" alt="article headline"/> </div><div class="media-text"> <h1>{{article.media.title | length(50)}}</h1> <h2>{{article.media.description | length(100)}}</h2> <h3>{{article.media.url}}</h3> </div></div></article>`,
    data: function() {
        return {
            dragging: false
        }
    },
    filters: {
        length: function (str, l) {
          return str.substr(0,l)+"...";
        }
      },
    methods: {
        pick_element: function(e){
            this.dragging = true;

             Game.selected_element_parent = Game.selected_element.parentElement;
             JS.element.remove_class(Game.selected_element, "error");
             e.preventDefault();
        },
        release_element: function(e){
         if(Game.selected_element){
             //Need to check position
             var position = Game.answers.filter(function(a){return [].slice.call(a.classList).indexOf('drop') != -1}).find(function(a){
                 var rect1 = JS.element.get_rect(a);
                 var rect2 = JS.element.get_rect(Game.selected_element);
                 return (rect2.x + (rect2.w/2)) > (rect1.x - 40) && (rect2.x + (rect2.w/2)) < (rect1.x + rect1.w +40) && (rect2.y + (rect2.h/2)) > (rect1.y-40) && (rect2.y + (rect2.h/2)) < (rect1.y + rect1.h + 40);
             }.bind(this));
              
             if(position){
                 
                Game.play_sound('drag');
                 if(position.children.length > 0){
                     //fails because parent is story-container
                     JS.element.remove_class(position.children[0], "error");
                     Game.selected_element_parent.appendChild(position.children[0]);
                    
                 }
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 position.appendChild(Game.selected_element);
             } else {
                 Game.play_sound('drop');
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 document.getElementById('elements_container').appendChild(Game.selected_element);
             }
             JS.element.remove_class(Game.selected_element, "error");
             var answer = Game.answers.filter(function(a){ return [].slice.call(a.classList).indexOf('drop') != -1});
             answer = answer.map(function(a){
                 
                return a.children[0] ? parseInt(a.children[0].attributes.data.value) : null;
             });
             Game.current_story.set_user_answer(answer);

         }
         Game.selected_element = null;
     },
     move_element: function(e){
          var position = JS.mouse.move(e);
          if(Game.selected_element){
              JS.element.move(Game.selected_element, position.x - document.getElementById('story-container').offsetLeft - document.getElementById('game-container').offsetLeft - (Game.selected_element.getBoundingClientRect().width/2), position.y - document.getElementById('story-container').offsetTop  - document.getElementById('game-container').offsetTop - (Game.selected_element.getBoundingClientRect().height/2));
          
          }
     }
    }, 
    props: ['article']
});


    
var ArticleSection = Vue.component('ArticleSection',{
    template : '<section id="generator" style="background-image: url(\'img/facebook.png\');"> <button v-on:click="btn_clicked=true;generate_article();" >{{message}}</button> <Article v-if="article" :article="article"></Article> </section>',
    data: function() {
        return {
            message: 'Générer un post',
            btn_clicked: false,
            article: ''
        }
    },
    methods: {
        generate_article: function() {
            this.message = "Génération...";
            // send get request
            var url = "https://just-acme-api.herokuapp.com/article";
            //var url = "http://localhost:3000/article";
            this.$http.post(url, {}).then(function (data, status, request) {
                // set data on vm
                if(data.status == 200){
                console.log(data);
                this.article = data.body;
                this.article.media.description = strip(this.article.media.summary.content);
                this.article.media.url = this.article.media.originId.replace("http://www.", "").replace("https://www.", "").replace(new RegExp(/[\/].*/), "");
                this.message="Générer un autre post";
                } else {
                    this.message="Erreur, réessayer";
                }
            }.bind(this));
        }
    },
    components: [Article],
});
var Tinder = Vue.component('Tinder',{
    template : `<section id="tinder"> <Article :article="article"></Article> </section> `,
    data: function() {
        return {
            article: {}
        }
    },
    methods: {
        get_article: function() {
            // send get request
            var url = "https://just-acme-api.herokuapp.com/trainer/article";
            //var url = "http://localhost:3000/article";
            this.$http.get(url, {}).then(function (data, status, request) {
                // set data on vm
                if(data.status == 200){
                console.log(data);
                    this.article = data.body;
                    this.article.media.description = strip(this.article.media.summary.content);
                    this.article.media.url = this.article.media.originId.replace("http://www.", "").replace("https://www.", "").replace(new RegExp(/[\/].*/), "");
                    
                } else {
                    
                }
            }.bind(this));
        }
    },
    beforeMount(){
        this.get_article()
    },
    props: ['article']
});
var EmailSection = Vue.component('EmailSection',{
    template : ' <section id="email" itemscope itemtype="http://schema.org/Offer" itemprop="offers"> <header> <h1>Intéressé ?</h1> </header> <img src="img/email.png" style="width:250px;max-width:100%;" alt="mailbox"/> <h2 itemprop="price" value="0€">Tu veux être le premier à faire décoller tes réseaux sociaux grâce au meilleur community manager automatisé ?</h2> <p>#FileTonEmail</p><div style="padding:20px;"> <input type="email" placeholder="hello@mail.xyz" v-model="email"/><button v-if="!email_success" v-on:click="save_email()">OK</button><button class="success" v-if="email_success" v-on:click="save_email()"><i class="material-icons">check</i></button> </div></section>',
    data: function() {
        return {
            email: '',
        email_success: false
        }
    },
    methods: {
       save_email: function() {
            console.log("coucou");
            // send get request
            var url = "https://just-acme-api.herokuapp.com/email";
            //var url = "http://localhost:3000/email";
            this.$http.post(url, {email: this.email}).then(function (data, status, request) {
                // set data on vm
                if(data.status == 200){
                    this.email_success = true;
                }
                console.log(data);
            }.bind(this));
        }
    }
});
var PresentationSection = Vue.component('PresentationSection',{
    template : '<section id="presentation"> <h1>Créer du contenu sur les réseaux sociaux te prend trop de temps ?</h1> <img src="img/man-computer.png" style="width:500px;max-width:100%;" alt="man on a computer"> <h2>Grâce à notre intelligence artificielle, trouver du contenu thématique à partager, rédiger un post optimisé avec un lien vers votre site et le poster sur Facebook se fait en un CLIC !</h2> </section> ',
    data: function() {
        return {
            article: {}
        }
    },
    methods: {

    }
});
var JumbotronSection = Vue.component('JumbotronSection',{
    template : 
    `<section style="background-image: url(\'img/city-dark.png\');background-position: bottom center;"> 
        <header> 
            <img src="img/acme-logo.png" alt="logo"/> 
        </header> 
        <h1 style="color: white;">Le premier community manager complêtement automatisé !</h1> 
        <h2>#IntelligenceArtificielle</h2> 
        <button>
            <i class="material-icons">keyboard_arrow_down</i>
        </button> 
    </section>`
});
var Home = { template: 
    `<div>
        <JumbotronSection></JumbotronSection> 
        <PresentationSection></PresentationSection>
        <ArticleSection></ArticleSection>
        <EmailSection></EmailSection>
    </div>`};

var Trainer = { template: 
    `<h1>Le post qui match ?</h1>
     <Tinder></Tinder>` };

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

