"use strict";function previewImage(a){if(a.files&&a.files[0]){var b=new FileReader;b.onload=function(a){var b=$(".image-preview").width(),c=new Image;c.src=a.target.result;var d=c.width,e=c.height,f=a.target.result,g=b,h=400,i=Math.min(g/d,h/e);e*=i,d*=i,$(".image-preview img").attr("src",f).css({height:e,width:d})},b.readAsDataURL(a.files[0])}}Parse.initialize("B1NGRVxybXDwN8s7HpKIunnzvKe4mW6bSDNi0hp6","qMl0DxT4FHssKEodsKAGTx5V3p5sDO5m3dk8wdGD"),$(".make-new-post").click(function(){$(".full-page").addClass("overlay"),$(".new-post").show(),$(".remove-new-post").show(),setTimeout(function(){$(".new-post").css({opacity:1}),$(".remove-new-post").css({opacity:1}),$(".overlay").css({opacity:1})},150)}),$(".remove-new-post").click(function(){$(".new-post").css({opacity:0}),$(".remove-new-post").css({opacity:0}),$(".overlay").css({opacity:0}),$(".full-page").css({opacity:1}),$(".image-upload-comment").val(""),$(".beer-name").val(""),$(".brewery-name").val(""),$(".image-upload-input").val(""),$(".image-preview").hide(),$(".image-filters").hide(),$(".reset-image-button").hide(),$(".uploader-container").show(),$(".rating span").each(function(){$(this).removeClass("stars")}),setTimeout(function(){$(".remove-new-post").hide(),$(".new-post").hide(),$(".full-page").removeClass("overlay")},410)}),$(".image-upload-input").change(function(){$(".image-upload-input")[0]?$(".preview-image-button").show():$(".preview-image-button").hide()}),$(".preview-image-button").click(function(){var a=$(".image-upload-input")[0];previewImage(a),$(".uploader-container").hide(),$(".preview-image-button").hide(),$(".image-preview").show(),$(".reset-image-button").show()});var canvas;$(".reset-image-button").click(function(){$(".preview-image-button").show(),$(".reset-image-button").hide(),$(".image-preview").hide(),$(".image-filters").hide(),$(".uploader-container").show(),$(".beer-name").val(""),$(".brewery-name").val(""),$(".image-upload-comment").val("")}),$(".post-button").click(function(){var a=$(".image-upload-input")[0];if(a.files.length>0){var b=a.files[0],c="photo.jpg",d=new Parse.File(c,b);d.save().done(function(){var a=new Post;a.set({beerName:$(".beer-name").val(),breweryName:$(".brewery-name").val(),comment:$(".image-upload-comment").val(),rating:rated,beerImage:d.url(),beerImageFile:d}),a.save().done(function(){$(".new-post").css({opacity:0}),$(".remove-new-post").css({opacity:0}),$(".overlay").css({opacity:0}),$(".full-page").css({opacity:1}),setTimeout(function(){$(".remove-new-post").hide(),$(".new-post").hide(),$(".full-page").removeClass("overlay")},410),app.collection.add(a)})})}});var rated;$(".rating span").click(function(){for(var a=5;a>=0;a--)$(".rate-"+a).removeClass("stars");rated=this.className,rated="rate-1"===rated?1:"rate-2"===rated?2:"rate-3"===rated?3:"rate-4"===rated?4:"rate-5"===rated?5:0;for(var b=rated;b>=0;b--)$(".rate-"+b).addClass("stars")});var Post=Parse.Object.extend({className:"post"}),FullPostCollection=Parse.Collection.extend({model:Post}),details,ThumbnailView=Parse.View.extend({template:_.template($(".thumbnail-template").text()),className:"thumbnail-container",events:{"click .beer-thumbnail":"details"},initialize:function(){$(".gallery-container").append(this.el),this.render();for(var a=this.model.get("rating"),b=0;a>=b;b++)this.$el.find(".thumb-rate-"+b).addClass("stars")},render:function(){var a=this.template(this.model.attributes);this.$el.html(a)},details:function(){details=new DetailView({model:this.model}),$(".detail-container").show(),$(".full-page").addClass("overlay"),$(".overlay").css({opacity:1})}}),DetailView=Parse.View.extend({template:_.template($(".detail-template").text()),className:"detail-contents",initialize:function(){$(".detail-container").append(this.el),this.render();for(var a=this.model.get("rating"),b=0;a>=b;b++)this.$el.find(".detail-rate-"+b).addClass("stars");$(".remove-detail-view").click(function(){$(".full-page").removeClass("overlay"),$(".full-page").css({opacity:1}),$(".overlay").css({opacity:0}),$(".detail-container").hide(),details.remove()})},render:function(){var a=this.template(this.model.attributes);this.$el.html(a)}}),AppView=Parse.View.extend({initialize:function(){this.collection=new FullPostCollection,this.collection.on("add",this.addPost),this.collection.fetch({add:!0})},addPost:function(a){new ThumbnailView({model:a})}}),app=new AppView;