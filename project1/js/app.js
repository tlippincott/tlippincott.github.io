var singleGlobalData = "";
var globalData = "";

/* object to hold artist information */
function SingleArtist(localID, name, albumCover) {
	this.localID = localID;
	this.name = name;
	this.albumCover = albumCover;
}

var otherAnswers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];  //array for random answers
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
	//$('#answer1').text(single[0].name);
	var single0  = new SingleArtist(0, singleGlobalData.name, singleGlobalData.images[0]);

	$('#albumArt').attr('src', single0.albumCover.url);

	for (var x = 1; x < globalData.artists.length + 1; x++){
		var objName = 'single' + x;

		objName  = new SingleArtist(x, globalData.artists[x - 1].name, globalData.artists[x - 1].images[0]);
	}
	/* randomize and display the remaining three answers */
	shuffle(otherAnswers);

	console.log(single0.name);
	//fourAnswers[0] = single0.name; //correct answer

	for (x = 1; x < 4; x++) {
		var miscName = 'single' + (x - 1);
		fourAnswers[x] = miscName.name;
	}

}

startOver();

function startOver() {

var availablePoints = 100;

/* Decrease the available points for the current photo */
var decreaseScore = setInterval(function() {
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

$('.button').click(function() {
	clearInterval(decreaseScore);

	$('.meter > span').stop(true, false);

	$('.meter > span').attr('style', 'width: 100%');

	startOver();
})

}

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