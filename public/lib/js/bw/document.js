function init()
{
	_database_connection = new DatabaseConnection();
	if ( devmode ) console.log( 'Log: INIT' );

	$pregame  =$('#pregame_form');
	$game = $('#game');
	$form = $('#score_form');
	$feedback = $('#feedback');

	$user_firstname = $('#user_firstname');
	$user_lastname = $('#user_lastname');
	$user_email = $('#user_email');
	$user_other_event = $('#other_event');

	$user_score = $('#user_game_score');

	$event_select = $('#user_event');

	$specify_other = $('#specify_other');
	$specify_other.hide();
	$user_score.prop('disabled', true);

	initGame();
	$game.show();
	//$form.show();

	$('#game_complete').click( function(){ gameComplete(); return false; });
	$('#submit_score').click( function(){ submitScore(); return false; });
	$('.play_again').click( function(){ replay(); return false; });
	$('.share_game').click( function(){ shareGame(); return false; });

	$event_select.change( eventSelected );
	$user_firstname.change( testEnableSubmitScore );
	$user_lastname.change( testEnableSubmitScore );
	$user_email.change( testEnableSubmitScore );
	$user_other_event.change( testEnableSubmitScore );

	$user_firstname.on('propertychange input', testEnableSubmitScore );
	$user_lastname.on('propertychange input', testEnableSubmitScore );
	$user_email.on('propertychange input', testEnableSubmitScore );
	$user_other_event.on('propertychange input', testEnableSubmitScore );

	$('#submit_score').attr("disabled", true);
}

var _game_raw_rime = 0;
function gameComplete(score)
{

	$game.hide();

	_game_raw_rime = Number( currGameTime * 1000 );

	$user_score.val( msToString(currGameTime) );
	//$user_goal.val('null');
	testEnableSubmitScore()
	$form.show();
	restartGame();
}

function eventSelected()
{

	if( $event_select.val() == 'event_other' )
	{
		$specify_other.show();
	}
	else
	{
		$specify_other.hide();
	}

	testEnableSubmitScore();
}

function submitScore()
{
	var send_obj = {};
	send_obj.score = _game_raw_rime; //$user_score.val();

	send_obj.name = $user_firstname.val() + ' ' + $user_lastname.val();

	send_obj.email = $user_email.val();

	send_obj.event =  $event_select.val()

	if( send_obj.event == 'event_other' )
	{
		send_obj.event = $user_other_event.val();
	}
	$('#submit_score').attr("disabled", true);

	_database_connection.sendScore( send_obj, scoreSubmitted );



	//_list_connection.sendScore( goal, score );


}

function scoreSubmitted()
{
	$form.hide();
	$feedback.show();
}

function shareGame()
{
	var subject = "Think you can beat my score?";
	var message = "Hi, I just took the Global Goals Challenge, play it and see if you can beat my score. If you beat my score you could win a fun prize.\r\n\r\nhttp://inside.unilever.com/global/brightfuture/Pages/GlobalGoalsChallenge.aspx";
	window.location.href = "mailto:?subject="+escape(subject)+"&body="+escape(message)+"";
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function testEnableSubmitScore()
{
	var enable_submit = true;
	if( !$user_firstname.val() )
	{
		if ( devmode ) console.log( 'Log LASTNAME ' + $user_firstname.val() )
		enable_submit = false;
	}
	if( !$user_lastname.val() )
	{
		if ( devmode ) console.log( 'Log LASTNAME ' + $user_lastname.val() )
		enable_submit = false;
	}
	if( !$user_email.val() )
	{
		if ( devmode ) console.log( 'Log LASTNAME ' + $user_email.val() )
		enable_submit = false;
	}
	else if( !isEmail($user_email.val()) )
	{
		enable_submit = false;
	}

	if( $event_select.val() == 'null' )
	{
		enable_submit = false;
	}

	if( $event_select.val() == 'event_other' )
	{
		if( !$user_other_event.val() )
		{
			enable_submit = false;
		}
	}


	if( enable_submit )
	{
		$('#submit_score').attr("disabled", false);
	}
	else
	{
		$('#submit_score').attr("disabled", true);
	}
}

function replay()
{
	$form.hide();
	$feedback.hide();
	$game.show();
}
