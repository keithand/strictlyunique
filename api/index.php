<?php

	require('../dbconnect.php');
	$catalog = array();

	$sql = "SELECT * FROM strictlyunique LIMIT 3";
	$results = mysql_query($sql);

	while($myrow = mysql_fetch_array($results)){
		$catalog[] = array(
			"thumbnail" => $myrow['image_sm'],
			"id" => $myrow['id'],
			"name" => $myrow['name'],
			"price" => $myrow['price'],
			"excerpt" => $myrow['desc_short'],
			"reviews" => $myrow['reviews'],
			"rating" => round($myrow['ratings'], 2),
			);
	};

	echo json_encode(array('catalog' => $catalog) );
	
?>