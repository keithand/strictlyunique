$(document).foundation();

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

//create main page markup
var mainMarkup = "<div class='content large-12 columns'>" +
					"<h1>Welcome!</h1>" +
					"<div id='homeBanner' class='row large-12 columns'></div>" +
					"{{each(i, product) catalog}}" +
						"<div class='item large-4 columns'>" +
						"<a href='#product?id=${product.id}'>" +
							"<img src='images/${product.thumbnail}' />" +
							"<p><a href='#product?id=${product.id}'>${product.name}</a></p>" +
							"<p>\$${product.price}</p>" +
						"</a>" +
						"</div>" +
						"{{/each}}" +
						"<hr>" +
					"</div>";

//Create the Catalog Markups
var catalogMarkup = "<h1>Catalog</h1>" +
					"<div class='content large-16 columns'>" +
					"{{each(i, product) catalog}}" +
						"<div class='item large-8 columns'>" +
							"<img src='images/${product.thumbnail}' />" +
							"<p><a href='#product?id=${product.id}'>${product.name}</a></p>" +
							"<p>\$${product.price}</p>" +
							"<p>Reviews:12</p> <p>rating: 5.0</p>" +
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
					"</div>";

var reviewMarkup = "<form action='add_review.php' method='post'>" +
						"<input type='text name='name' />" +
						"<textarea name='review'></textarea>" +
						"<input type='hidden' name='cat_id' value='<?php echo $pd/ ?>' />" +
						"<select name='rating'>" +
							"<option value='0'></option>" +
							"<option value='1'></option>" +
							"<option value='2'></option>" +
							"<option value='3'></option>" +
							"<option value='4'></option>" +
							"<option value='5'></option>" +
						"</select>" + 
						"<input type='submit' name='submit' />" +
					"</form>";



//register the cataog markups as catalog templates in jQuery templates system
$.template("catalogTemplate", catalogMarkup);
$.template("mainTemplate", mainMarkup);
$.template("productTemplate", productMarkup);
$.template("reviewTemplate", reviewMarkup);




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
		$.tmpl("reviewTemplate", data).appendTo('#main');
	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#main').html('Sorry! We are having an issue with our servers. Please try again later.');
	});
};

$('document').ready(function(){
	$(window).trigger('hashchange');
});

















