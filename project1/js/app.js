var singleGlobalData = "";
var globalData = "";
var singleTrackData = "";
var globalTrackData = "";
var allArtists = [];
var artistNames = [];
var tmpArtists = [];  //temporary array used to randomize artists
var currentArtist = 0;
var correctAnswer = "";
var decreaseScore = "";
var availablePoints = 99;  //maximum points available for each image
var playerScore = 0;  //player's score for the round
var totalScore = 0;  //player's total score for the game
var roundNum = 1;  //current round number
var sound;  //variable to hold the audio tag
var muted = 0;  //flag to indicate if sound is muted

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
	[5, "03r4iKL2g2442PT9n2UKsx"],
	[6, "71lGEtP9qYXDsSXjfexTqO"],
	[7, "5pKCCKE2ajJHZ9KAiaK11H"],
	[8, "4EnEZVjo3w1cwcQYePccay"],
	[9, "26dSoYclwsYLMAKD3tpOr4"],
	[10, "3dkbV4qihUeMsqN4vBGg93"],
	[11, "2Hkut4rAAyrQxRdof7FVJq"],
	[12, "6deZN1bslXzeGvOLaLMOIF"],
	[13, "1Mxqyy3pSjf8kZZL4QVxS0"],
	[14, "2cnMpRsOVqtPMfq7YiFE6K"],
	[15, "485uL27bPomh29R4JmQehQ"]];

/* If this is the first round, continue to request the
** artist information, otherwise wait until the end of
** each round before requesting a new set of information. */
if (roundNum === 1) {
	getArtistInfo();
}

function getArtistInfo() {

	var getArtist = searchList[Math.floor((Math.random() * 16))][1];

	/* retrieve information for the beginning artist */
	$.ajax({
		url: 'https://api.spotify.com/v1/artists/' + getArtist,
		dataType: 'json',
		type: 'GET',
		success: function(singleData) {
			singleGlobalData = singleData;
			console.log(singleData);

			allArtists[0] = [singleGlobalData.name, singleGlobalData.images[0].url, singleGlobalData.id];
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

			for (var z = 0; z < 20; z++) {
				tmpArtists[z] = [globalData.artists[z].name, globalData.artists[z].images[0].url, globalData.artists[z].id];
			}

			shuffleArtists();
		},
		fail: function(error) {
			console.log(error);
		}
	})


	/* combine data into one array and randomize entries */
	function shuffleArtists() {
		shuffle(tmpArtists);  //randomize artist list

		var i = 1;

		for (var x = 0; x < 20; x++){
			allArtists[i] = tmpArtists[x];
			artistNames[i] = globalData.artists[x].name;

			i++
		}
	}
}

/* get music clip from Spotify */
function getMusicClip(id) {
	$.ajax({
		url: 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=US',
		dataType: 'json',
		type: 'GET',
		success: function(trackData) {
			globalTrackData = trackData;
			console.log(trackData);

			$('#trackPlay').attr('src', globalTrackData.tracks[0].preview_url);

			if (muted) {
				sound.pause();
			}

		},
		fail: function(error) {
			console.log(error);
		}
	})
}

/* load the photos and answers */
function loadArtists() {
	getMusicClip(allArtists[currentArtist][2]);  //get the music clip for the current artist

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
		    width: $(this).data("origWidth")
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

		availablePoints = 99;

		//enable any disabled buttons
		$('.button').disable(false);
		$('.button').removeClass('disabled');

		$('#albumArt').remove();

		if (currentArtist === 10) {
			totalScore += playerScore;

			if (roundNum === 3) {
				var snd = document.getElementById('trackPlay');  //stop audio
				snd.pause();
				$('#endsDialog').dialog('open');  //if end of game
			}
			else {
				var snd = document.getElementById('trackPlay');  //stop audio
				snd.pause();
				$('#roundsDialog').dialog('open');  //if beginning of next round
			}
			
		}
		else {
			loadArtists();
		}	
	}
	else {
		playerScore -= 10;  //decrease player score by 10 for an incorrect answer

		$('.scoreNum').text(playerScore);

		//disable button so player does not click it again
		$(this).disable(true);
		$(this).addClass('disabled');
	}

})

/* randomize the passed in array */
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

/* spinning record at beginning of game */
$('#openingLogo').dialog({
	autoOpen: true,
	close: function( event, ui ) {

  		$('#openingDialog').dialog('open');
	},
	dialogClass: "no-close",
	minWidth: 500,
	modal: true,
	open: function() {

    	rotateAnimation("vinyl",30);

    	$('#vinyl').click(function() {
    		$(this).closest('.ui-dialog-content').dialog('close');
    	})
    	
	},
	title: "Click the Record to Play"
});

/* dialog box appearing after spinning record logo */
$('#openingDialog').dialog({
	autoOpen: false,
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

	    	$(this).dialog("close");
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
	open: function() {
		$(this).keyup(function(e) {
     		var code = (e.keyCode ? e.keyCode : e.which);
     		if(code === 13) {     //Enter keycode
       			$(':button:contains("OK")').click();
     		}
    	});
	},
	show: { effect: "highlight", duration: 800 },
	title: "Welcome"
});

/* message box that appears at end of each round */
$('#roundsDialog').dialog({
	autoOpen: false,
	close: function( event, ui ) {
		$('.roundNum').text(roundNum);

		playerScore = 0;
		$('.scoreNum').text('0');

		loadArtists();
	},
	dialogClass: "no-close",
	buttons: [
	  {
	    text: "OK",
	    click: function() {

	    	$( this ).dialog( "close" );
	    }
		
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    }
	],
	minWidth: 400,
	modal: true,
	open: function( event, ui ) {
		$('#roundScore').text(playerScore);
		$('#totalScore').text(totalScore);

		roundNum++

		currentArtist = 0;

		getArtistInfo();
	},
	show: { effect: "highlight", duration: 800 },
	title: "Next Round"
});

/* message box that appears at end of game */
$('#endsDialog').dialog({
	autoOpen: false,
	close: function( event, ui ) {
		exit();
	},
	dialogClass: "no-close",
	buttons: [
	  {
	    text: "OK",
	    click: function() {

	    	$( this ).dialog( "close" );
	    }
		
	      // Uncommenting the following line would hide the text,
	      // resulting in the label being used as a tooltip
	      //showText: false
	    }
	],
	minWidth: 400,
	modal: true,
	open: function( event, ui ) {
		$('#endRoundScore').text(playerScore);
		$('#endTotalScore').text(totalScore);
	},
	show: { effect: "highlight", duration: 800 },
	title: "End of Game"
});

/* mute button */
$('#muteBtn').click(function () {
	sound = document.getElementById('trackPlay');

	if (muted) {
		sound.play();
		$('#muteBtn').attr('src', 'images/speaker.png');
		muted = 0;
	}
	else {
		sound.pause();
		$('#muteBtn').attr('src', 'images/speaker_mute.png');
		muted = 1;
	}
})

/* rotate record image at beginning of game */
var looper;
var degrees = 0;
function rotateAnimation(el,speed){
	var elem = document.getElementById(el);
	if(navigator.userAgent.match("Chrome")){
		elem.style.WebkitTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Firefox")){
		elem.style.MozTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("MSIE")){
		elem.style.msTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Opera")){
		elem.style.OTransform = "rotate("+degrees+"deg)";
	} else {
		elem.style.transform = "rotate("+degrees+"deg)";
	}
	looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
	degrees++;
	if(degrees > 359){
		degrees = 1;
	}
}
