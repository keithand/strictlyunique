$(document).foundation();

//create main page markup
var mainMarkup = "<div class='content large-12 columns'>" +
					"<h1>Welcome!</h1>" +
					"<div id='homeBanner' class='row large-12 columns'></div>" +
					"<h3>Our Latest Products</h3>" +
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
						"<hr>" +
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
							"<div class='product-description'><p><a href='${product.name}'>${product.name}</a></p>" +
							"<p>\$${product.price}</p>" +
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
		$(document).find('title').html('About Us');

		//load about us page
		showAbout();
	} else if(newLocation.selector =='#product'){
		$(document).find('title').html('Product');
		showProduct(newLocation.params);
	} else {
		$(document).find('title').html('Home');
		//load homepage
		showHtmlContent('home.html');
	}
});

$('document').ready(function(){
	$(window).trigger('hashchange');
});

















