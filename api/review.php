<?php
	
	require('../dbconnect.php');

	function escape_data($data){
		if(ini_get('magic_quotes_gpc')){
			$data = stripslashes($data);
		}
		if(!is_numeric($data) ){
			$data = mysql_real_escape_string($data);
		}
		return $data;
	}

	if($_SERVER['REQUEST_METHOD'] == 'POST'){

		//run all of the form data through the escape_data function
		$name = escape_data($_POST['name']);
		$review = escape_data($_POST['review']);
		$rating = escape_data($_POST['rating']);
		$cat_id = $_POST['cat_id'];

		$returnMsg = array();

		$returnMsg['submittedData'] = "<p>Name: $name rating: $rating email: $email review: $review</p>";

		//this code asses a new review to the reviews table

		$sql = "INSERT INTO reviews (id, name, review, rating, cat_id, date)
		VALUES ('', '$name', '$review', '$rating', '$cat_id', NOW() )";

		$result = mysql_query($sql);


		$returnmsg['insertReviewInfo'] = "<p>Info:" . mysql_info() . "</p>";
		$returnmsg['insertReviewError'] = "<p>Error:" . mysql_error() . "</p>";


		//set up SQL query to get all of the reviews for this product.
		$sql = "SELECT * FROM reviews WHERE cat_id = '$cat_id'";

		$result = mysql_query($sql);

		//Count and average all the ratings taken from all reviews of this product.
		$count = 0;
		$average_rating = 0;
		$total_rating = 0;

		while($myrow = mysql_fetch_array($result)){

			$average_rating += $myrow['rating'];
			$count++;
		
		};

		//check that some records were returned
		if($count > 0){

			$average_rating = $average_rating / $count;
		} else {
			//if no records were returned, set to 0 to avoid an error
			$average_rating = 0;
		}

		//check that some records were returned
		//divide the total rating by count to get the average
		// $average_rating = $total_rating / $count;
	
		//update the catalog table with the new review count and average
		$sql = "UPDATE strictlyunique SET ratings='$average_rating', reviews='$count' 
		WHERE id='$cat_id' LIMIT 1";

		//send this last query
		mysql_query($sql);

		$returnmsg['insertReviewInfo'] = "<p>Info:" . mysql_info() . "</p>";
		$returnmsg['insertReviewError'] = "<p>Error:" . mysql_error() . "</p>";

		echo json_encode(array('msg' => $returnmsg) );
	
	} else {
		$cat_id = $_GET['cat_id'];
		$reviews = array();

		//make an UPDATE query to update the rating and comments in the menu database
		$sql = "SELECT * FROM reviews WHERE cat_id='$cat_id'";
		
		//send the last query
		$result = mysql_query($sql);

		while($myrow = mysql_fetch_array($result) ){
			//This is another array, which will be indexed with the db column name
			$record = array(
				'id' => $myrow['id'],
				'cat_id' => $myrow['cat_id'],
				'name' => $myrow['name'],
				'review' => $myrow['review'],
				'rating' => $myrow['rating'],
				'date' => date("M d Y", strtotime($myrow['date'] ) )
				);
			$reviews[] = $record;
		}

		echo json_encode(array('reviews' => $reviews) );
	}

?>





