<?php

	require('../dbconnect.php');
	$id = $_GET['id'];
	$sql = "SELECT * FROM strictlyunique WHERE id='$id'";
	$result = mysql_query($sql);

	$myrow = mysql_fetch_array($result);

	$product = array(
		'image' => $myrow['image_lg'],
		'thumb' => $myrow['image_sm'],
		'name' => $myrow['name'],
		'price' => $myrow['price'],
		'description' => $myrow['desc_long'],
		"reviews" => $myrow['reviews'],
		"rating" => round($myrow['rating'], 2),
		);

	echo json_encode(array('product' => $product) );

?>