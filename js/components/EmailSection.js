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