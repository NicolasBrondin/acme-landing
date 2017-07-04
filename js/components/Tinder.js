var Tinder = Vue.component('Tinder',{
    template : `<section id="tinder"> <Article :article="article"></Article> </section> `,
    data: function() {
        return {
        }
    },
    methods: {
        get_article: function() {
            // send get request
            var url = "http://localhost:3000/trainer/article";
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