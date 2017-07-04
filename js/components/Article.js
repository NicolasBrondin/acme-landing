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


    