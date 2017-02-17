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
var decreaseScore = 0;

setInterval(function() {
	$('#decPoints').text(score);

	//console.log("score is " + score);
	//console.log("decreaseScore is " + decreaseScore);

	decreaseScore = Math.ceil(100 - .01);
	score = score - (decreaseScore);
}, 5000);

$(".meter > span").each(function() {
	$(this)
	  .data("origWidth", 0)
	  .width($(this).width())
	  .animate({
	    width: $(this).data("origWidth") // or + "%" if fluid
	  }, 10000);
});