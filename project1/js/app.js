var singleGlobalData = "";
var globalData = "";
var correctAnswer = "";
var decreaseScore = "";
var availablePoints = 100;  //maximum points available for each image
var playerScore = 0;

/* object to hold artist information */
function SingleArtist(localID, name, albumCover) {
	this.localID = localID;
	this.name = name;
	this.albumCover = albumCover;
}

var fourAnswers = [];

/* Beginning list of artist ID's. This ID is needed
** in order to return the list of related artists
** and the corresponding information. Otherwise some
** form of input is needed in the search string,
** such as an artist name or an album title.
*/
var searchList = [
	[0, "36QJpDe2go2KgaRleHCDTp"],
	[1, "2ye2Wgw4gimLv2eAKyk1NB"],
	[2, "5W5bDNCqJ1jbCgTxDD0Cb3"],
	[3, "5a2EaR3hamoenG9rDuVn8j"],
	[4, "0vn7UBvSQECKJm2817Yf1P"],
	[5, "03r4iKL2g2442PT9n2UKsx"]];

var getArtist = searchList[Math.floor((Math.random() * 5))][1];

/* retrieve information for the beginning artist */
$.ajax({
	url: 'https://api.spotify.com/v1/artists/' + getArtist,
	dataType: 'json',
	type: 'GET',
	success: function(singleData) {
		singleGlobalData = singleData;
		console.log(singleData);
	},
	fail: function(error) {
		console.log(error);
	}
})

/* retrieve information for related artists */
$.ajax({
	url: 'https://api.spotify.com/v1/artists/' + getArtist + '/related-artists',
	dataType: 'json',
	type: 'GET',
	success: function(data) {
		globalData = data;
		console.log(data);

		loadArtists();
	},
	fail: function(error) {
		console.log(error);
	}
})

/* load the photos and answers */
function loadArtists() {

	 $('#albumArt').attr('src', singleGlobalData.images[0].url);

	fourAnswers[0] = [1, singleGlobalData.name]; //correct answer

	shuffle(globalData);

	for (x = 1; x < 4; x++) {
		fourAnswers[x] = [0, globalData.artists[x - 1].name];
	}

	shuffle(fourAnswers);

	/* place the text into the buttons */
	for (x = 1; x < 5; x++) {
		var btnName = '#answer' + x;
		$(btnName).text(fourAnswers[x - 1][1]);

		if (fourAnswers[x - 1][0] === 1) {
			correctAnswer = btnName.substring(1, 8);  //button ID minus the '#'
		}
	}

}

startOver();

function startOver() {

/* Decrease the available points for the current photo */
	decreaseScore = setInterval(function() {
	$('#decPoints').text(availablePoints);

	availablePoints--

	if (availablePoints < 0) {
		clearInterval(decreaseScore);
	}

}, 93);

/* Animate the progress bar */
$(".meter > span").each(function() {
	$(this)
	  .data("origWidth", 0)
	  .width($(this).width())
	  .animate({
	    width: $(this).data("origWidth") // or + "%" if fluid
	  }, 10000);
});
}

/* answer button clicked */
$('.button').click(function() {
	if (this.id === correctAnswer) {
		clearInterval(decreaseScore);

		playerScore += availablePoints;

		$('.scoreNum').text(playerScore);

		$('.meter > span').stop(true, false);  //stop the meter

		$('.meter > span').attr('style', 'width: 100%');  //reset the meter to 100

		availablePoints = 100;

		startOver();
	}
	else {
		playerScore -= 10;  //decrease player score by 10 for an incorrect answer

		$('.scoreNum').text(playerScore);
	}

})

/* randomize the remaining three answers */
function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}