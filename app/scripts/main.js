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

// clicking the "X" in the upper right hand corner will remove the new post div and reset the value for all inputs
$('.remove-new-post').click(function () {
	$('.new-post').css({'opacity': 0});
	$('.remove-new-post').css({'opacity': 0});
	$('.overlay').css({'opacity': 0});
	$('.full-page').css({'opacity': 1});
	$('.image-upload-comment').val('');
	$('.beer-name').val('');
	$('.brewery-name').val('');
	$(".image-upload-input").val('');
	$('.image-preview').hide();
	$('.image-filters').hide();
	$('.reset-image-button').hide();
	$('.uploader-container').show();
	// reset the stars to blank
	$('.rating span').each(function () {
		$(this).removeClass('stars');
	});
	setTimeout(function (){
		$('.remove-new-post').hide();
		$('.new-post').hide();
		$('.full-page').removeClass('overlay');
	},410);
});


// Any changes made to the uploader will display the preview button
$(".image-upload-input").change(function () {
	if ($(".image-upload-input")[0]) {
		$('.preview-image-button').show();
	}
	else {
		$('.preview-image-button').hide();
	}
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

var canvas;
// Will take an input+type=file data and render it to the targeted location
function previewImage (input) {

	if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var divWidth = $('.image-preview').width();
				
				var localImage = new Image();
				localImage.src = e.target.result;
				var imageWidth = localImage.width;
				var imageHeight = localImage.height;
				var beerURL = e.target.result;
				
				var maxWidth = 	divWidth
				var maxHeight = 400;

				var imgRatio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
				imageHeight *= imgRatio;
				imageWidth *= imgRatio;

				$('.image-preview img').attr('src',beerURL).css({'height': imageHeight, 'width': imageWidth })
				

			};
			reader.readAsDataURL(input.files[0]);
	}
}


// Clicking the reset image will hide the following: the preview image, the reset button, 
// and the preview button. The uploader will be displayed again
$('.reset-image-button').click(function () {
	$('.preview-image-button').show();
	$('.reset-image-button').hide();
	$('.image-preview').hide();
	$('.image-filters').hide();
	$('.uploader-container').show();
	$('.beer-name').val('');
	$('.brewery-name').val('');
	$('.image-upload-comment').val('');
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

			var post = new Post();
			post.set({
				"beerName"		: $('.beer-name').val(),
				"breweryName"	: $('.brewery-name').val(),
				"comment"		: $('.image-upload-comment').val(),
				"rating"		: rated,
				"beerImage"		: parseFile.url(),
				"beerImageFile"	: parseFile
			});
			post.save().done(function () {
				$('.new-post').css({'opacity': 0});
				$('.remove-new-post').css({'opacity': 0});
				$('.overlay').css({'opacity': 0});
				$('.full-page').css({'opacity': 1});
				setTimeout(function (){
					$('.remove-new-post').hide();
					$('.new-post').hide();
					$('.full-page').removeClass('overlay');
				},410);
				app.collection.add(post);
			});
		});
	}
});

var rated;

$('.rating span').click(function () {
	for (var i = 5; i >=0; i--) {
		$('.rate-'+i).removeClass('stars');
	}
	rated = this.className;
	if(rated === 'rate-1') {
		rated = 1;
	}

	else if (rated === 'rate-2') {
		rated = 2;
	}

	else if (rated === 'rate-3') {
		rated = 3;
	}

	else if (rated === 'rate-4') {
		rated = 4;
	}

	else if (rated === 'rate-5') {
		rated = 5;
	}

	else {
		rated = 0;
	}

	for (var j = rated; j >= 0; j--) {
		$('.rate-'+j).addClass('stars');
	}
});

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

		});
	},

	render: function () {
		var renderedTemplate = this.template(this.model.attributes);
		this.$el.html(renderedTemplate);
	}

});
///////////////////////////////////////////////////////////////////
/// App View //////////////////////////////////////////////////////
/////// Parse Events //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

var AppView = Parse.View.extend({
	initialize: function () {
		this.collection = new FullPostCollection();
		this.collection.on('add', this.addPost);
		this.collection.fetch({add:true});
	},

	addPost: function (model) {
		new ThumbnailView({model: model});
	}

});

var app = new AppView();
