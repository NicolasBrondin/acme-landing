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