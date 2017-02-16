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