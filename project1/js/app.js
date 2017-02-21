var singleGlobalData = "";
var globalData = "";
var allArtists = [];
var artistNames = [];
var currentArtist = 0;
var correctAnswer = "";
var decreaseScore = "";
var availablePoints = 100;  //maximum points available for each image
var playerScore = 0;

/* have inputs styled like the jquery ui plugin */
$('input').addClass("ui-widget ui-widget-content ui-corner-all");

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

		allArtists[0] = [singleGlobalData.name, singleGlobalData.images[0].url];
		artistNames[0] = singleGlobalData.name;
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

		var i = 1;
		var j = 0;

		for (var x = 0; x < 20; x++){
			allArtists[i] = [globalData.artists[x].name, globalData.artists[x].images[0].url];
			artistNames[i] = globalData.artists[x].name;

			i++
		}

		//loadArtists();
	},
	fail: function(error) {
		console.log(error);
	}
})

/* load the photos and answers */
function loadArtists() {

	$('.imageContainer').append('<img id="albumArt">');

	$('#albumArt').on('load', function() {
		var imgHeight = $('#albumArt').height();  //calculate top margin to vertically center imgage
		var adjustMargin = 400 - imgHeight;

		if (adjustMargin > 0) {
			adjustMargin = adjustMargin / 2;
		}

		$('#outerContainer').css({'margin-top' : adjustMargin});

		$('#albumArt').fadeIn(10000, function() {
	 		//animation complete
		 })
	}).attr('src', allArtists[currentArtist][1]);

	fourAnswers[0] = [1, allArtists[currentArtist][0]]; //correct answer

	var correctName = allArtists[currentArtist][0];

	shuffle(artistNames);

	for (x = 1; x < 4; x++) {
		if (artistNames[x - 1] != correctName){  //random name does not match the correct name
			fourAnswers[x] = [0, artistNames[x - 1]];
		}
		else {
			fourAnswers[x] = [0, artistNames[10]];
		}
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

	currentArtist++

	$('#currentPic').text(currentArtist);

	startOver();  //start to decrease the available points and start the progress bar

}

function startOver() {

/* Decrease the available points for the current photo */
	decreaseScore = setInterval(function() {
	$('#decPoints').text(availablePoints);

	availablePoints--

	if (availablePoints < 0) {
		clearInterval(decreaseScore);
		availablePoints = 0;
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

		if (currentArtist === 10) {
			alert("Round over, sucka!");
			exit();
		}

		$('.meter > span').attr('style', 'width: 100%');  //reset the meter to 100

		availablePoints = 100;

		//enable any disabled buttons
		$('.button').disable(false);
		$('.button').removeClass('disabled');

		$('#albumArt').remove();

		loadArtists();
	}
	else {
		playerScore -= 10;  //decrease player score by 10 for an incorrect answer

		$('.scoreNum').text(playerScore);

		//disable button so player does not click it again
		$(this).disable(true);
		$(this).addClass('disabled');
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

/* button disable function */
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

/* exit the program */
function exit( status ) {

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function(e) {
    	e.preventDefault();
    	e.stopPropagation();
    }, false);

    var handlers = [
        'copy', 'cut', 'paste', 'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup',
        'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'DOMNodeInserted', 'DOMNodeRemoved',
        'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged',
        'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput', 'abort', 'close', 'dragdrop',
        'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
    }

    for (var i = 0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function(e) {
        	stopPropagation(e);
        }, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

/* message box that appears at beginning of game */
$('#openingDialog').dialog({
	autoopen: false,
	close: function( event, ui ) {
		loadArtists();
	},
	dialogClass: "no-close",
	buttons: [
	  {
	    text: "OK",
	    click: function() {
	    	if ($('#playerName').val() === "") {
	    		$('.playName').text("I am No Name");
	    	}
	    	else {
	    		$('.playName').text($('#playerName').val());
	    	}

	    	$( this ).dialog( "close" );
	    }
		
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    }
	],
	focus: function( event, ui ) {
		$('playerName').focus();
	},
	minWidth: 400,
	modal: true,
	show: { effect: "highlight", duration: 800 },
	title: "Welcome"
});