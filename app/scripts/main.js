"use strict";

Parse.initialize("B1NGRVxybXDwN8s7HpKIunnzvKe4mW6bSDNi0hp6", "qMl0DxT4FHssKEodsKAGTx5V3p5sDO5m3dk8wdGD");


///////////////////////////////////////////////////////////////////
/// New Image/Post ////////////////////////////////////////////////
/////// Click events //////////////////////////////////////////////
////////////// Parse Events ///////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Click the "New" button to add an overlay to the rest of the screen and pop up the new post maker
$('.make-new-post').click(function () {
	$('.full-page').addClass('overlay');
	$('.new-post').show();
	//dislays "X" to cancel new post
	$('.remove-new-post').show();
	setTimeout(function (){
		$('.new-post').css({'opacity': 1});
		$('.remove-new-post').css({'opacity': 1});
		$('.overlay').css({'opacity': 1});
	},150);
});

$('.remove-new-post').click(function () {
	$('.new-post').css({'opacity': 0});
	$('.remove-new-post').css({'opacity': 0});
	$('.overlay').css({'opacity': 0});
	$('.full-page').css({'opacity': 1});
	setTimeout(function (){
		$('.remove-new-post').hide()
		$('.new-post').hide();
		$('.full-page').removeClass('overlay');
	},410);
})



// Any changes made to the uploader will display the preview button
$(".image-upload-input").change(function () {
	$('.preview-image-button').show();
});

// Clicking the preview image button will display the local file in the hidden preview div by calling
// previewImage, show the hidden div and hide the uploader
$('.preview-image-button').click(function () {
	var fileUpload = $(".image-upload-input")[0];
	previewImage(fileUpload);
	$('.uploader-container').hide();
	$('.preview-image-button').hide();
	$('.image-preview').show();
	$('.reset-image-button').show();
});

// Will take an input+type=file data and render it to the targeted location
function previewImage (input){

	if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.image-preview img').attr('src', e.target.result);
			};
			reader.readAsDataURL(input.files[0]);
	}
}

// Clicking the reset image will hide the following: the preview image, the reset button, 
// and the preview button. The uploader will be displayed again
$('.reset-image-button').click(function () {
	$('.preview-image-button').hide();
	$('.reset-image-button').hide();
	$('.image-preview').hide();
	$('.uploader-container').show();
});


// Clicking the post button will check for a file to upload, and if it exists, will use this information 
// to create a new Parse.File. This file is then attached to a new post and saved.
$('.post-button').click(function () {
	var fileUpload = $(".image-upload-input")[0];
	if (fileUpload.files.length > 0) {
		var file = fileUpload.files[0];
		var name = "photo.jpg";
	 
		var parseFile = new Parse.File(name, file);
		parseFile.save().done(function () {

			console.log('parse is', parseFile);
			console.log('parse.url is', parseFile.url());

			var post = new Post();
			post.set({
				"beerName"		: $('.beer-name').val(),
				"breweryName"	: $('.brewery-name').val(),
				"comment"		: $('.image-upload-comment').val(),
				"rating"		: rated,
				"beerImage"		: parseFile.url()
			});
			post.save().done(function () {
				console.log('success');
			});
			app.collection.add(post);
		})
		
	}
});

var rated;

$('.rating span').click(function () {
	for (var i = 5; i >=0; i--) {
		$('.rate-'+i).removeClass('stars');
	}
	rated = this.className;
	if(rated == 'rate-1') {
		rated = 1;
	}

	else if (rated == 'rate-2') {
		rated = 2;
	}

	else if (rated == 'rate-3') {
		rated = 3;
	}

	else if (rated == 'rate-4') {
		rated = 4;
	}

	else if (rated == 'rate-5') {
		rated = 5;
	}

	else {
		rated = 0;
	}

	for (var i = rated; i >= 0; i--) {
		$('.rate-'+i).addClass('stars');
	}
})

///////////////////////////////////////////////////////////////////
/// New Image/Post ////////////////////////////////////////////////
/////// Parse Events //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

var Post = Parse.Object.extend({
	className: "post"
});

var FullPostCollection = Parse.Collection.extend({
	model: Post
});


///////////////////////////////////////////////////////////////////
/// Thumbnail View ////////////////////////////////////////////////
/////// Parse Events //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
var details;

var ThumbnailView = Parse.View.extend({
	template: _.template($('.thumbnail-template').text()),
	className: "thumbnail-container",

	events: {
		'click .beer-thumbnail'	: 'details'
	},

	initialize: function () {
		$('.gallery-container').append(this.el);
		this.render();
		// Get the beerImage property, set its value as the source of the image
		var beerPic = this.model.get('beerImage');
		this.$el.find('img').attr('src', beerPic);
		// Get the rating property, use it's value to add the stars class to the appropriate number of stars
		var rating = this.model.get('rating');
		for (var i = 0; i <= rating; i++) {
			this.$el.find('.thumb-rate-'+i).addClass('stars');
		}
	},

	render: function () {
		var renderedTemplate = this.template(this.model.attributes);
		this.$el.html(renderedTemplate);
	},

	details: function () {
		details = new DetailView({model: this.model});
		$('.detail-container').show();
		$('.full-page').addClass('overlay');
		$('.overlay').css({'opacity': 1});
	}
});


///////////////////////////////////////////////////////////////////
/// Detail View ///////////////////////////////////////////////////
/////// Parse Events //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

var DetailView = Parse.View.extend({
	template: _.template($('.detail-template').text()),
	className: 'detail-contents',

	initialize: function () {
		$('.detail-container').append(this.el);
		this.render();

		var beerPic = this.model.get('beerImage');
		this.$el.find('img').attr('src', beerPic);

		var rating = this.model.get('rating');
		for (var i = 0; i <= rating; i++) {
			this.$el.find('.detail-rate-'+i).addClass('stars');
		}

		$('.remove-detail-view').click(function () {
			$('.full-page').removeClass('overlay');
			$('.full-page').css({'opacity': 1});
			$('.overlay').css({'opacity': 0});
			$('.detail-container').hide();

			details.remove();

		})
	},

	render: function () {
		var renderedTemplate = this.template(this.model.attributes);
		this.$el.html(renderedTemplate);
	}

})
///////////////////////////////////////////////////////////////////
/// App View //////////////////////////////////////////////////////
/////// Parse Events //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

var AppView = Parse.View.extend({
	initialize: function () {
	this.collection = new FullPostCollection();
	this.collection.on('add', this.addPost)
	this.collection.fetch({add:true});
	},

	addPost: function (model){
		new ThumbnailView({model: model});
	}

});

var app = new AppView();






