//Initiate foundation framework
$(document).foundation();

//Initiate facebook like and share button
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1159867664031151";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


//create main page markup
var mainMarkup = "<div class='content large-12 columns'>" +
					"<div id='homeBanner' class='large-12 columns'>" +
						"<img src='images/banner.png' />" +
					"</div>" +
					"{{each(i, product) catalog}}" +
						"<div class='item large-4 columns'>" +
						"<a href='#product?id=${product.id}'>" +
							"<img src='images/${product.thumbnail}' />" +
							"<p><a href='#product?id=${product.id}'>${product.name}</a></p>" +
							"<p>\$${product.price}</p>" +
							"<p>Reviews: ${product.reviews}</p> <p>rating: ${product.rating}</p>" +
						"</a>" +
						"</div>" +
						"{{/each}}" +
					"</div>";

//Create the Catalog Markups
var catalogMarkup = "<div class='content large-12 columns'>" +
					"<h1>Catalog</h1>" +
					"<div class='content large-16 columns'>" +
					"{{each(i, product) catalog}}" +
						"<div class='item large-8 columns'>" +
							"<img src='images/${product.thumbnail}' />" +
							"<p><a href='#product?id=${product.id}'>${product.name}</a></p>" +
							"<p>\$${product.price}</p>" +
							"<p>Reviews: ${product.reviews}</p> <p>rating: ${product.rating} </p>" +
						"</div>" +
						"{{/each}}" +
					"</div>";

//create main page markup
var productMarkup = "<h1>${product.name}</h1>" +
					"<div class='content large-16 columns'>" +
						"<div class='single-item large-16 columns'>" +
							"<img src='images/${product.image}' class='product-large'/>" +
							"<div class='product-description'><p class='product-name'><a href='${product.name}'>${product.name}</a></p>" +
							"<div class='fb-like' data-href='http://nerdyowl.co/strictlyunique' data-layout='button' data-action='like' data-show-faces='false' data-share='true'></div>" +
							"<p class='price-product'>\$${product.price}</p>" +
							"<p>${product.description}</p></div>" +
						"</div>" +
							"<form action='' method='post' class='form large-16 columns'>" +
								"<h4>Write a Review</h4>" +
								"Name: <input type='text' name='name' />" +
								"Review: <textarea name='review'></textarea>" +
								"<input type='hidden' name='cat_id' value='${product.id}' id='cat-cat' />" +
								"Your rating: <select name='rating'>" +
									"<option value='0'></option>" +
									"<option value='1'>&#9734;</option>" +
									"<option value='2'>&#9734; &#9734;</option>" +
									"<option value='3'>&#9734; &#9734; &#9734;</option>" +
									"<option value='4'>&#9734; &#9734; &#9734; &#9734;</option>" +
									"<option value='5'>&#9734; &#9734; &#9734; &#9734; &#9734;</option>" +
								"</select>" + 
								"<input type='submit' name='submit' id='submitReview' />" +
							"</form>" +
							"<div class='large-16' id='reviews'></div>" +
						"</div>";

var reviewMarkup = "" +
					"{{each(i, item) reviews}}" +
					"<div class='review_item large-16 columns'>" +
						"<h5>Name: ${item.name}</h5> <h6>Date: ${item.date}<h6> <h6>Rating: ${item.rating}</h6>" +
						"<p>${item.review}</p>" +
					"</div>" +
					"{{/each}}";

var ratingDisplay = function(rating){
	if(rating == 5 ){
		"<span class='rating'>☆☆☆☆☆</span>"
	} else if(rating == 4){
		"<span class='rating'>☆☆☆☆</span>"
	} else if (rating == 3){
		"<span class='rating'>☆☆☆</span>"
	} else if (rating == 2){
		"<span class='rating'>☆☆</span>"
	} else {
		"<span class='rating'>☆</span>"
	}
};

//create main page markup
var aboutMarkup = "<div class='content large-12 columns'>" +
					"<h1>About Us</h1>" +
						"<div class='aboutrow'>" +
							"<div class='large-6 columns'>" +
							"<h5>Why Strictly Unique?</h5>" +
							"<p>We support designers. Everything we sell is authentic and has a story.</p>" + 
							"<p>Everything we sell is a little bit bizarre. We only sell special things. Things with heart. Things made by human hands or dreamt up in a makers mind.</p>" +
							"</div>" +
							"<div class='large-6 columns'>" +
								"<img src='images/storefront.png' />" +
							"</div>" +
						"</div>" +
					"</div>";

//register the cataog markups as catalog templates in jQuery templates system
$.template("reviewTemplate", reviewMarkup);
$.template("catalogTemplate", catalogMarkup);
$.template("mainTemplate", mainMarkup);
$.template("productTemplate", productMarkup);



var showReviews = function(params){
	$.ajax({
		url:'api/review.php',
		data:params,
		dataType: 'json'
	}).done(function(data, textStatus, jqXHR){
		$('#reviews').empty();
		$.tmpl("reviewTemplate", data).appendTo('#reviews');
	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#main').html('Sorry! We are having an issue getting the reviews. Please try again later.');
		console.log(jqXHR);

	});
};

var showCatalog = function(){
	$.ajax({
		url:"api/catalog.php",
		dataType: 'json'
	}).done(function(data, textStatus, jqXHR){
		$('#main').empty();
		$.tmpl("catalogTemplate", data).appendTo('#main');
	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#main').html('Sorry! We are having an issue with our servers. Please try again later.');
		console.log(jqXHR);
	});
};

var showHtmlContent = function(){
	$.ajax({
		url:'api/index.php',
		dataType:'json'
	}).done(function(data, textStatus, jqXHR){
		$('#main').empty();
		$.tmpl('mainTemplate', data).appendTo('#main');
	}).fail(function(textStatus, errorThrown, jqXHR){
		$('#main').html('Sorry! We are having an issue with our servers. Please try again later.');
		console.log(jqXHR);
	});
};

var showProduct = function(params){
	$.ajax({
		url:"api/product.php",
		data:params,
		dataType: 'json'
	}).done(function(data, textStatus, jqXHR){
		$('#main').empty();
		$.tmpl("productTemplate", data).appendTo('#main');
		showReviews( {cat_id: data.product.id} );
		addClickEventForReviewForm();
	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#main').html('Sorry! We are having an issue with our servers. Please try again later.');
		console.log(jqXHR);
	});
};


var addClickEventForReviewForm = function(){
	$("#submitReview").on('click', function(event){
		event.preventDefault();

		//get the parameters
		var params = {
			name: $(this).siblings('input[type=text]').val(),
			cat_id: $(this).siblings('input[type=hidden]').val(),
			review: $(this).siblings('textarea').val(),
			rating: $(this).siblings('select').val(),
		};

		$.ajax({
			url:'api/review.php',
			data:params,
			dataType:'json',
			type:'post'
		}).done(function(data, textStatus, jqXHR){
			//refresh reviews
			showReviews( {cat_id: params.cat_id} );
			console.log('The ajax request in addClickEventForReviewForm is working!');
		}).fail(function(jqXHR, textStatus, errorThrown){
			$('#main').html('Sorry! We are having a server problem. Please try again later.');
			console.log("Sorry, but the addClickEventForReviewForm function is not working.");
			console.log(jqXHR);

		});
	});
}


/***********************************************
*	HASH ROUTING
* ******************************************/

var processHash = function(){
	var hashString = window.location.hash, selector = hashString, param = {};
	if (hashString.indexOf("?") > -1){
		//we have parameters after the hash string
		selector = hashString.substring(0, hashString.indexOf("?") );

		//process parameters
		var paramString =  hashString.substring(hashString.indexOf("?") + 1);
	
		/****
		* The param string has the format of name=value&name=value
		* First split the string using &. We will have an array.
		* name=value, name=value,...
		* Then we will split the string with = for rach array item.
		****/

		var paramArr = paramString.split('&');

		for(var i = 0; i < paramArr.length; i++){
			var paramItem = paramArr[i].split('=');
			param[paramItem[0]] = paramItem[1];
		}
	}

	return {selector: selector, params: param};
};

$(window).on("hashchange", function(){
	var newLocation = processHash();

	if(newLocation.selector == '#catalog'){
		$(document).find('title').html('Catalog');

		//load catalog page
		showCatalog();
	} else if (newLocation.selector == '#about'){
		$('#main').empty();
		$('#main').html(aboutMarkup);
		$(document).find('title').html('About Us');
		
	} else if(newLocation.selector =='#product'){
		$(document).find('title').html('Product');
		showProduct(newLocation.params);
	} 
	// else if (newLocation.selector == '#location'){
	// 	$('#main').empty();
	// 	$(this).html(locationMarkup);
	// 	location();
	// } 
	else {
		$(document).find('title').html('Home');
		//load homepage
		showHtmlContent('home.html');
	}
});

$('document').ready(function(){
	$(window).trigger('hashchange');
});

















