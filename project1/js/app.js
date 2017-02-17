var value = 1.0;
var refreshIntervalId;
var globalData = "";

var input = prompt("Enter Artist:");


$.ajax({
	url: 'https://api.spotify.com/v1/search?q=' + input + '&type=artist',
	dataType: 'json',
	type: 'GET',
	success: function(data) {
		console.log(data);
		globalData = data;

		var image = globalData.artists.items[0].images[0].url;

		//$('#original').attr('src', image);
		$('img').attr('src', image);
	},
	fail: function(error) {
		console.log(error);
	}
})

var score = 100;


/* Decrease the available points for the current photo */
var decreaseScore = setInterval(function() {
	$('#decPoints').text(score);

	score = score -= 1;

	if (score < 0) {
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
})