var value = 1.0;
var refreshIntervalId;
var globalData = "";

function singleArtist(localID, name, albumCover) {
	this.localID = localID,
	this.name = name,
	this.albumCover = albumCover
}

var single = [];

var searchList = [
	[0, "36QJpDe2go2KgaRleHCDTp"],
	[1, "2ye2Wgw4gimLv2eAKyk1NB"],
	[2, "5W5bDNCqJ1jbCgTxDD0Cb3"],
	[3, "5a2EaR3hamoenG9rDuVn8j"],
	[4, "0vn7UBvSQECKJm2817Yf1P"],
	[5, "03r4iKL2g2442PT9n2UKsx"]];

var getArtist = searchList[Math.floor((Math.random() * 5))][1];

$.ajax({
	url: 'https://api.spotify.com/v1/artists/' + getArtist + '/related-artists',
	dataType: 'json',
	type: 'GET',
	success: function(data) {
		globalData = data;
		console.log(data);

		for (var x = 0; x < data.artists.length; x++){

			single[x]  = new singleArtist(x, globalData.artists[x].name, globalData.artists[x].images[0]);

		}
	},
	fail: function(error) {
		console.log(error);
	}
})

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