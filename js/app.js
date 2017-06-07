 
            var post_to_html = function(post){
                var html ="";
                return html;
            };
            
            function strip(html)
            {
               var tmp = document.createElement("DIV");
               tmp.innerHTML = html;
               return tmp.textContent || tmp.innerText || "";
            }
		
			var app = new Vue({
				el: '#Vue',
				data: {
					loaded: true,
					message: 'Générer un post',
					btn_clicked: false,
                    article: '',
                    email: '',
                    email_success: false
				},
				methods: {
					generate_article: function() {
						// send get request
                        var url = "https://just-acme-api.herokuapp.com/article/gaming";
                        //var url = "http://localhost:3000/article/gaming";
						this.$http.post(url, {}).then(function (data, status, request) {
							// set data on vm
                            console.log(data);
							app.article = data.body;
                            app.article.media.description = strip(app.article.media.summary.content);
                            app.article.media.url = app.article.media.originId.replace("http://www.", "").replace("https://www.", "").replace(new RegExp(/[\/].*/), "");
						});
					},
                    save_email: function() {
                        console.log("coucou");
						// send get request
                        var url = "https://just-acme-api.herokuapp.com/email";
                        //var url = "http://localhost:3000/email";
						this.$http.post(url, {email: this.email}).then(function (data, status, request) {
							// set data on vm
                            if(data.status == 200){
                                app.email_success = true;
                            }
                            console.log(data);
							});
					},
				},
                  filters: {
                    length: function (str, l) {
                      return str.substr(0,l)+"...";
                    }
                  }
			});