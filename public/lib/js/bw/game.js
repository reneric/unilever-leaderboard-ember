var gamePaused = false, tilesEnabled = true;
var pages;
var currPage;
var progress = 0;
var lastTime = 0, currGameTime = 0, game3started = false, gameTimes = { game1:0, game2:0, game3:0 }; 
var cTile1,cTile2,cTile3,cTile4,cTileSet;

var g4DataIndex, g4DataCount, g4LastIconClass = '', g4Data = [ 
	{
		numGoals:1,
		brand:'lipton',
		ambition:'<p>To revolutionise tea by creating more taste and value from every leaf, to benefit growers, makers and drinkers.</p>',
		tiles:getTiles(15)
	},
	{
		numGoals:1,
		brand:'bandj',
		ambition:'<p>Ben & Jerry\'s focus is on equality, climate change and sustainably sourcing ingredients to make the best possible ice cream, in the best possible way.</p>',
		tiles:getTiles(13)
	},
	{
		numGoals:1,
		brand:'breyers',
		ambition:'<p>Committed to caring for families around the world – by looking to source the best quality sustainable ingredients, like 100% of our vanilla from Rainforest Alliance certified farms. Bringing goodness to every family, whether they eat Breyers or help make it.</p>',
		tiles:getTiles(15)
	},
	{
		numGoals:1,
		brand:'knorr',
		ambition:'<p>Knorr and WFP are partnering to ensure all adolescents have the nourishment they need to transform their futures and become the change-makers of tomorrow, in their families and communities.</p>',
		tiles:getTiles(2)
	},
	{
		numGoals:1,
		brand:'hellmanns',
		ambition:'<p>To make Hellmann’s use of sustainably sourced ingredients the Blue ribbon standard for the industry.</p>',
		tiles:getTiles(2)
	},
	{
		numGoals:1,
		brand:'flora',
		ambition:'<p>To make high cholesterol history.</p>',
		tiles:getTiles(3)
	},
	{
		numGoals:1,
		brand:'dove',
		ambition:'<p>To make beauty a source of confidence not anxiety for women everywhere – ensuring that the next generation grows up enjoying a positive relationship with the way they look, and help them reach their full potential.</p>',
		tiles:getTiles(5)
	},
	{
		numGoals:1,
		brand:'lifebuoy',
		ambition:'<p>Change the hygiene behaviour of 1 billion people across Asia, Africa, and Latin America by promoting the benefits of hand washing with soap at key times.</p>',
		tiles:getTiles(6)
	},
	{
		numGoals:1,
		brand:'vaseline',
		ambition:'<p>By 2020, Vaseline will help heal the skin of 5 million people affected by poverty or emergencies.</p>',
		tiles:getTiles(3)
	},
	{
		numGoals:1,
		brand:'signal',
		ambition:'<p>To encourage children and their parents to Brush Day & Night, for a healthier and happier life.</p>',
		tiles:getTiles(3)
	}
];

function initGame() {
	
	
	// init sounds
	sndCongrats = new Audio("./lib/audio/congratulations.mp3");
	sndCorrect = new Audio("./lib/audio/correct.mp3");
	sndIncorrect = new Audio("./lib/audio/incorrect.mp3");
	sndStars = new Audio("./lib/audio/stars.mp3");
	sndTic = new Audio("./lib/audio/ticktoc.mp3");
	sndTic.loop = true;
	
	pages = {
		splash 	: $('.game-page#splash'),
		map 	: $('.game-page#map'),
		game1 	: $('.game-page#game-1'),
		game2 	: $('.game-page#game-2'),
		game3 	: $('.game-page#game-3')
	}
	
	currPage = pages.splash;
	
	// init btns
	$('#btn-start').click( function(e) { e.preventDefault(); changeGamePage(pages.game3); });
	$('#hud #btn-replay, #end-game-3 #btn-replay').click( function(e) { e.preventDefault(); restartGame(); });
	$('#hud #btn-help').click( function(e) { e.preventDefault(); showHelp(); });
	$('#modal-help #btn-close').click( function(e) { e.preventDefault(); hideHelp(); });
	$('#modal-help #btn-replay').click( function(e) { e.preventDefault(); restartGame(); });
	
	// modal views 
	$('#end-game-1 #btn-close').click( function(e) { 
		e.preventDefault(); 
		hideModalView();
		changeGamePage(pages.map); 
	});
	$('#end-game-2 #btn-close').click( function(e) { 
		e.preventDefault(); 
		hideModalView();
		changeGamePage(pages.map); 
	});
	$('#game-3-intro #btn-close').click( function(e) { 
		e.preventDefault();
		hideModalView();
	});
	$('#end-game-3 #btn-close').click( function(e) { 
		e.preventDefault();
		gameComplete(currGameTime);
	});
	
	
	$('#game-btn-1 .game-btn').click( function(e) { e.preventDefault(); if ($(this).hasClass('completed')) return; changeGamePage(pages.game1); });
	$('#game-btn-2 .game-btn').click( function(e) { e.preventDefault(); if ($(this).hasClass('locked') || $(this).hasClass('completed')) return; changeGamePage(pages.game2); });
	$('#game-btn-3 .game-btn').click( function(e) { e.preventDefault(); if ($(this).hasClass('locked') || $(this).hasClass('completed')) return; changeGamePage(pages.game3); });
	
	currPage.fadeIn();
	updateMapIcons();
	
	showHUD(true);
	
	$('#hud #btn-replay').hide();
	$('#hud .hud-time').addClass('hidden');
	$('#hud .hud-num-questions').addClass('hidden');
}

function restartGame() {
	
	if (currPage == pages.game3) {
		sndTic.pause();
	}
	currGameTime = 0;
	progress = 0;
	$('#overlay').addClass('hidden');
	$('.modal-view').addClass('hidden');
	$('#hud .hud-time').addClass('hidden');
	$('#hud .hud-num-questions').addClass('hidden');
	$('.game-btn').removeClass('completed');
	hideFeedback();
	changeGamePage(pages.splash);
}


function initGame1() { 
	if ( devmode ) console.log( 'initGame1' );
	
	$('#game-1 .gg-tiles').empty();
	resetDropZones();
	
	var tile1 = newTile(6,1,0);
	var tile2 = newTile(2,1,0);
	var tile3 = newTile(5,3,0);
	var tile4 = newTile(8,3,0);
	var tile5 = newTile(12,2,0);
	var tile6 = newTile(15,2,0);
	var tiles = [tile1,tile2,tile3,tile4,tile5,tile6];
	cTileSet = shuffle(tiles);
	
	game1NextTiles();
	
	currGameTime = 0;
	
	$('#hud .hud-time').addClass('hidden');
	//doCountDown(true);
}

function showFeedback(el, correct, doHide) {
	if (correct) {
		sndCorrect = new Audio("./lib/audio/correct.mp3");
		sndCorrect.play();
	} else {
		sndIncorrect = new Audio("./lib/audio/incorrect.mp3");
		sndIncorrect.play();
	}
	var hide = doHide || false;
	var $icon = (correct) ? $(el).find('.icon-tick') : $(el).find('.icon-oops');
	$icon.addClass('showing');
	if (doHide) setTimeout(function () { $icon.removeClass('showing'); }, 800);
}

function hideFeedback() {
	$('.icon-tick, .icon-oops').removeClass('showing');
}

function game1NextTiles() {
	
	if ( devmode ) console.log( 'game1NextTiles' );
	
	cTile1 = cTileSet.shift();
	cTile2 = cTileSet.shift();
	
	cTile1.addClass('tile-pos-g1a');
	cTile2.addClass('tile-pos-g1b');
	
	cTile1.hide();
	cTile2.hide();
	
	$('#game-1 .gg-tiles').append(cTile1, cTile2);
	
	
	cTile1.fadeIn();
	cTile2.fadeIn();
	
	$(".draggable").draggable({
		revert: 'invalid',
		revertDuration: 300,
		stop: game1dragStop
	});
	
	$(".droppable").droppable({
		accept: function(item) {
			return $(this).data("identifier") == item.data("target");
		},
		drop: function(event, ui) {
			var $this = $(this);
			$this.droppable( "option", "disabled", true );
			ui.draggable.position({
				my: "center",
				at: "center",
				of: $this,
				using: function(pos) {
					$(this).addClass('ui-draggable-is-dropped');
					$(this).animate(pos, 200, "linear");
					$(this).draggable( "option", "disabled", true );
					game1CheckTilesCorrect();
				}
			});
		}
	});

}

function game1dragStop(event,ui) {
	var pos1 = {top:ui.position.top + 50, left:ui.position.left + 50 };
	
	$('.game-page#game-1 .panels .zone').each(function() {
		var pos2 = $(this).offset();
		var empty = !$(this).hasClass('ui-droppable-disabled');
		if (pos1.top >=  pos2.top && pos1.top < pos2.top + 115 && pos1.left >=  pos2.left && pos1.left < pos2.left + 115 && empty) {
			showFeedback($(this).parent().parent(), false, true);
		}
	});
		
}

function game1CheckTilesCorrect() {
	
	$('.game-page#game-1 .panels .zone-panel').each(function() {
		var dropped = true;
		if ($(this).find('.icon-tick').hasClass('showing')) { dropped = false; } 
		$(this).find('.zone').each(function() {
			if (!$(this).hasClass('ui-droppable-disabled')) {
				dropped = false;
			}
		});
		if (dropped) {
			showFeedback($(this), true);
		}
	});
	
	if (cTile1.draggable( "option", "disabled") && cTile2.draggable( "option", "disabled")) {
		
		if (cTileSet.length == 0) {
			game1Complete();
			return;
		}
		game1NextTiles();
	}
}

function game1Complete() {
	if ( devmode ) console.log( 'GAME 1 COMPLETE' );
	//doCountDown(false);
	progress = 1;
	
	$('#game-btn-1 .game-btn').addClass('completed');
	//setTimeout(function() { changeGamePage(pages.map); }, 400);
	setTimeout( function() { showModalView('#end-game-1'); }, 400);
	//changeGamePage(pages.map);
}


function initGame2() { 
	if ( devmode ) console.log( 'initGame1' );
	
	$('#game-2 .gg-tiles').empty();
	resetDropZones();
	
	var tile1 = newTile(5,1,0);
	var tile2 = newTile(2,2,0);
	var tile3 = newTile(3,3,0);
	var tiles = [tile1,tile2,tile3];
	cTileSet = shuffle(tiles);
	
	cTile1 = cTileSet.shift();
	cTile2 = cTileSet.shift();
	cTile3 = cTileSet.shift();
	
	cTile1.addClass('tile-pos-g2a');
	cTile2.addClass('tile-pos-g2b');
	cTile3.addClass('tile-pos-g2c');
	
	cTile1.hide();
	cTile2.hide();
	cTile3.hide();
	
	$('#game-2 .gg-tiles').append(cTile1, cTile2, cTile3);
	
	cTile1.fadeIn();
	cTile2.fadeIn();
	cTile3.fadeIn();
	
	$(".draggable").draggable({
		revert: 'invalid',
		revertDuration: 300,
		stop: game2dragStop
	});
	
	$(".droppable").droppable({
		accept: function(item) {
			return $(this).data("identifier") == item.data("target");
		},
		drop: function(event, ui) {
			var $this = $(this);
			$this.droppable( "option", "disabled", true );
			ui.draggable.position({
				my: "center",
				at: "center",
				of: $this,
				using: function(pos) {
					$(this).addClass('ui-draggable-is-dropped');
					$(this).animate(pos, 200, "linear");
					$(this).draggable( "option", "disabled", true );
					game2CheckTilesCorrect();
				}
			});
		}
	});
	
	$('#hud .hud-time').addClass('hidden');
	//doCountDown(true);
}

function game2dragStop(event,ui) {
	var pos1 = {top:ui.position.top + 50, left:ui.position.left + 50 };
	
	$('.game-page#game-2 .zone-panel').each(function() {
		var zone = $(this).find('.zone')[0];
		var pos2 = $(zone).offset();
		var empty = !$(zone).hasClass('ui-droppable-disabled');
		if (pos1.top >=  pos2.top && pos1.top < pos2.top + 115 && pos1.left >=  pos2.left && pos1.left < pos2.left + 115 && empty) {
			showFeedback($(this), false, true);
		}
	});
		
}

function game2CheckTilesCorrect() {
	$('.game-page#game-2 .panels .zone-panel').each(function() {
		var dropped = true;
		$(this).find('.zone').each(function() {
			if (!$(this).hasClass('ui-droppable-disabled')) {
				dropped = false;
			}
		});
		if (dropped) {
			showFeedback($(this), true);
		}
	});
	
	if (cTile1.draggable( "option", "disabled") && cTile2.draggable( "option", "disabled") && cTile3.draggable( "option", "disabled")) {
		if (cTileSet.length == 0) {
			game2Complete();
			return;
		}
	}
}

function game2Complete() {
	if ( devmode ) console.log( 'GAME 2 COMPLETE' );
	//doCountDown(false);
	progress = 2;
	
	$('#game-btn-2 .game-btn').addClass('completed');
	setTimeout( function() { showModalView('#end-game-2'); }, 400);
	//setTimeout( function() { changeGamePage(pages.map) }, 400);
}

function initGame3() { 
	if ( devmode ) console.log( 'initGame3' );
	
	$('#game-3 .gg-tiles').empty();
	$('.hud-num-questions').removeClass('hidden');
	$('#hud .hud-time').removeClass('hidden');
	
	resetDropZones();
	
	game3started = false;
	currGameTime = 0;
	g4DataIndex = 0;
	g4DataCount = 10;
	$('#hud .hud-time span').html(msToString(currGameTime));
	$('.hud-num-questions span').html('Q'+(g4DataIndex+1));
					
	g4Data = shuffle(g4Data);
	game3NextQuestion();
	showModalView('#game-3-intro');
	
}

function game3NextQuestion() {
	
	if ( devmode ) console.log( 'game3NextQuestion' );
	
	var qObj = g4Data[g4DataIndex];
	
	hideFeedback();
	resetDropZones();
	
	cTileSet = qObj.tiles;
	cTileSet = shuffle(cTileSet);
	cTile1 = cTileSet[0];
	cTile2 = cTileSet[1];
	cTile3 = cTileSet[2];
	cTile4 = cTileSet[3];
	
	cTile1.hide();
	cTile2.hide();
	cTile3.hide();
	cTile4.hide();
	
	cTile1.css({'top':'','left':''}).removeClass('tile-pos-g3a tile-pos-g3b tile-pos-g3c tile-pos-g3d ui-draggable-is-dropped').addClass('tile-pos-g3a');
	cTile2.css({'top':'','left':''}).removeClass('tile-pos-g3a tile-pos-g3b tile-pos-g3c tile-pos-g3d ui-draggable-is-dropped').addClass('tile-pos-g3b');
	cTile3.css({'top':'','left':''}).removeClass('tile-pos-g3a tile-pos-g3b tile-pos-g3c tile-pos-g3d ui-draggable-is-dropped').addClass('tile-pos-g3c');
	cTile4.css({'top':'','left':''}).removeClass('tile-pos-g3a tile-pos-g3b tile-pos-g3c tile-pos-g3d ui-draggable-is-dropped').addClass('tile-pos-g3d');
	
	$('#game-3 .gg-tiles').empty().append(cTile1, cTile2, cTile3, cTile4);
	$('.game-page#game-3 .question-panel .desc').html(qObj.ambition);
	$('.game-page#game-3 .question-panel .icon').removeClass(g4LastIconClass).addClass(qObj.brand);
	g4LastIconClass = qObj.brand;
	
	$('.game-page#game-3 .zone#zone-2').css('display',(qObj.numGoals == 1) ? 'none' : 'block');
	
	cTile1.fadeIn();
	cTile2.fadeIn();
	cTile3.fadeIn();
	cTile4.fadeIn();
	
	$(".draggable").draggable({
		revert: 'invalid',
		revertDuration: 300,
		start: function() {
			if (!game3started) {
				game3started = true;
				doCountDown(true);
			}
		},
		stop: game3dragStop
	});
	
	$(".droppable").droppable({
		accept: function(item) {
			return $(this).data("identifier") == item.data("target");
		},
		drop: function(event, ui) {
			tilesEnabled = false;
			var $this = $(this);
			$this.droppable( "option", "disabled", true );
			ui.draggable.position({
				my: "center",
				at: "center",
				of: $this,
				using: function(pos) {
					$(this).addClass('ui-draggable-is-dropped');
					$(this).animate(pos, 200, "linear");
					$(this).draggable( "option", "disabled", true );
					setTimeout(game3TileDropped,400);
				}
			});
		}
	});

	$('#g3-container').fadeIn();
}

function game3dragStop(event,ui) {
	var pos1 = {top:ui.position.top + 50, left:ui.position.left + 50 };
	
	$('.game-page#game-3 .zone-panel').each(function() {
		var zone = $(this).find('.zone')[0];
		var pos2 = $(zone).offset();
		var empty = !$(zone).hasClass('ui-droppable-disabled');
		if (pos1.top >=  pos2.top && pos1.top < pos2.top + 115 && pos1.left >=  pos2.left && pos1.left < pos2.left + 115 && empty) {
			showFeedback($(this), false, true);
		}
	});
}

function game3TileDropped() {
	g4DataIndex++;
	$('.game-page#game-3 .panels .zone-panel').each(function() {
		var dropped = true;
		$(this).find('.zone').each(function() {
			if (!$(this).hasClass('ui-droppable-disabled')) {
				dropped = false;
			}
		});
		if (dropped) {
			showFeedback($(this), true);
		}
	});
	
	if (g4DataIndex == g4DataCount) {
		game3Complete();
		return;
	}
	$('.hud-num-questions span').html('Q'+(g4DataIndex+1));
	
	setTimeout(function () {
		$('#g3-container').fadeOut(400, game3NextQuestion);
	},400);
}

function game3Complete() {
	if ( devmode ) console.log( 'GAME 3 COMPLETE' );
	doCountDown(false);
	progress = 3;
	
	$('#game-btn-3 .game-btn').addClass('completed');
	$('span#gametime').html(msToString(currGameTime));
	showModalView('#end-game-3');
	
	sndCongrats.play();
}

function changeGamePage(page) {
	
	if ( devmode ) console.log( 'changeGamePage: ', page);
	
	var lastPage = currPage;
	currPage = page;
	
	currPage.fadeIn();
	lastPage.fadeOut(400,function() {
		lastPage.removeClass('active');
		currPage.addClass('active');	
	});
	
	switch (page) {
		case pages.map: {
			$('.hud-num-questions').addClass('hidden');
			updateMapIcons();
			showHUD(true);
			break;	
		}
		case pages.game1: {
			showHUD(true);
			initGame1();
			break;	
		}
		case pages.game2: {
			showHUD(true);
			initGame2()
			break;	
		}
		case pages.game3: {
			showHUD(true);
			initGame3();
			break;	
		}
		default: {
			// splash
			showHUD(true);
			$('#hud #btn-replay').hide();
			break;	
		}
	}
}

function showHelp() {
	if (gamePaused) {
		hideHelp();
	} else {
		gamePaused = true;
		showModalView('#modal-help');
		if (currPage == pages.game3) {
			sndTic.pause();
		}
	}
}

function hideHelp() {
	gamePaused = false;
	lastTime = Date.now();
	if (currPage == pages.game3 && game3started) {
		sndTic.play();
	}
	hideModalView();
}


function showHUD(s) {
	var show = s || false;
	if (show) {
		
		$('#hud #btn-replay').show();
		$('#hud').removeClass('hidden');
	} else {
		$('#hud').addClass('hidden');
	}
}

function updateMapIcons() {
	
	if ( devmode ) console.log( 'updateMapIcons: ', progress);
	
	var $gBtn1 = $('#game-btn-1 .game-btn');
	var $gBtn2 = $('#game-btn-2 .game-btn');
	var $gBtn3 = $('#game-btn-3 .game-btn');
	
	$gBtn1.parent().find('.star').removeClass('active');
	$gBtn2.parent().find('.star').removeClass('active');
	$gBtn3.parent().find('.star').removeClass('active');
	
	switch (progress) {
		case 0: {
			$gBtn1.removeClass('locked');
			$gBtn2.addClass('locked');
			$gBtn3.addClass('locked');
			break;	
		}
		case 1: {
			$gBtn1.removeClass('locked');
			$gBtn2.removeClass('locked');
			$gBtn3.addClass('locked');
			
			$gBtn1.parent().find('.star').addClass('active');
			setTimeout(function() { sndStars.play(); }, 600);
			break;	
		}
		case 2: {
			$gBtn1.removeClass('locked');
			$gBtn2.removeClass('locked');
			$gBtn3.removeClass('locked');
			
			$gBtn1.parent().find('.star').addClass('active');
			$gBtn2.parent().find('.star').addClass('active');
			setTimeout(function() { sndStars.play(); }, 600);
			break;	
		}
		case 3: {
			$gBtn1.parent().find('.star').addClass('active');
			$gBtn2.parent().find('.star').addClass('active');
			$gBtn3.parent().find('.star').addClass('active');
			setTimeout(function() { sndStars.play(); }, 600);
		}
	}
}

function showModalView(identifier) {
	$('#overlay').removeClass('hidden');
	$(identifier).removeClass('hidden');
}

function hideModalView() {
	$('#overlay').addClass('hidden');
	$('.modal-view').addClass('hidden');
}

function newTile(id, target) {
	return $('<div class="gg-tile draggable" id="gg-tile-'+id+'" data-target="'+target+'"><div class="gg-tile-inner"></div></div>');
}

var timeinterval;
function doCountDown(start) {
	if (start) {
		// start timer tick
		if ( devmode ) console.log( 'TIMER START' );
		lastTime = Date.parse(new Date());
	   	timeinterval = setInterval(timerTick,33);
		timerTick();
		sndTic.play();
	} else {
		if ( devmode ) console.log( 'TIMER STOP' );
		sndTic.pause();
		// stop timer tick
		clearInterval(timeinterval);
	}
}

function timerTick() {
	if (gamePaused) return;
	var t = Date.now();
	var ms = t - lastTime;
	currGameTime += ms;
	
	$('#hud .hud-time span').html(msToString(currGameTime));
	
	lastTime = t;
}

function msToString(msecs) {
	
	var d, h, m, s, ms, pad = function(n, len) {
		var s = n.toString();
		return (new Array( (len-s.length+1) ).join("0")) + s;
	};
	
	ms = msecs % 1000;
	s = Math.floor(currGameTime / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;
	ms = Math.floor(ms / 10);
	
	return [pad(m,2),pad(s,2),pad(ms,2)].join(':');
}

function getTiles(numA,numB) {
	var a = numA;
	var b = numB || randomTile(a);
	var c = randomTile(a,b);
	var d = randomTile(a,b,c);
	return [
		newTile(a,1,0),
		newTile(b,(numB) ? 1 : -1 ,0),
		newTile(c,-1,0),
		newTile(d,-1,0)
	]
}

function randomTile(notA, notB, notC) {
	var rand = Math.floor(Math.random() * 16) + 1;
	while (rand == notA || rand == notB || rand == notC)  {
		rand = Math.floor(Math.random() * 16) + 1;
	}
	return rand;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function resetDropZones() {
	$(".droppable").each(function() {
		if ($(this).hasClass( "ui-droppable-disabled" )) {
			$(this).droppable( "option", "disabled", false );
		}
	});	
}