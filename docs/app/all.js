function strip(e){var t=document.createElement("DIV");return t.innerHTML=e,t.textContent||t.innerText||""}!function(e,t,a,n,s,i,c){e.GoogleAnalyticsObject=s,e[s]=e[s]||function(){(e[s].q=e[s].q||[]).push(arguments)},e[s].l=1*new Date,i=t.createElement(a),c=t.getElementsByTagName(a)[0],i.async=1,i.src=n,c.parentNode.insertBefore(i,c)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),ga("create","UA-100592263-1","auto"),ga("send","pageview"),window.$crisp=[],window.CRISP_WEBSITE_ID="e695ada8-1d7d-4dbf-a432-d4f99eedde68",function(){d=document,s=d.createElement("script"),s.src="https://client.crisp.im/l.js",s.async=1,d.getElementsByTagName("head")[0].appendChild(s)}();var post_to_html=function(e){var t="";return t},app=new Vue({el:"#Vue",data:{loaded:!0,message:"Générer un post",btn_clicked:!1,article:"",email:"",email_success:!1},methods:{generate_article:function(){this.message="Génération...";var e="http://localhost:3000/article";this.$http.post(e,{}).then(function(e,t,a){200==e.status?(console.log(e),app.article=e.body,app.article.media.description=strip(app.article.media.summary.content),app.article.media.url=app.article.media.originId.replace("http://www.","").replace("https://www.","").replace(new RegExp(/[\/].*/),""),app.message="Générer un autre post"):app.message="Erreur, réessayer"})},save_email:function(){console.log("coucou");var e="https://just-acme-api.herokuapp.com/email";this.$http.post(e,{email:this.email}).then(function(e,t,a){200==e.status&&(app.email_success=!0),console.log(e)})}},filters:{length:function(e,t){return e.substr(0,t)+"..."}}});