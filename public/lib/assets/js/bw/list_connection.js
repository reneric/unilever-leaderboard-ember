function ListConnection()
{
	var self = this;
	
	self.userName;
	self.userMCO;
	self.userEmail;
	
	self.getValues = function()
	{
		try {
			// ACTION
			$().SPServices({
				operation: "GetUserProfileByName",
				async: false,
				AccountName: $().SPServices.SPGetCurrentUser(),
				completefunc: function (xData, Status) {
				
					$(xData.responseXML).find("PropertyData > Name").each(function() {
					if($(this).text() == 'unileverMRDMCO'){
						self.userMCO = $(this).parent().find("Values").text();
						}
					if($(this).text() == 'UserName'){
						self.userName = $(this).parent().find("Values").text();
						}
					if($(this).text() == 'WorkEmail'){
						self.userEmail = $(this).parent().find("Values").text();
						}
					});
				}
			});
		}
		catch (e) {
		   if ( devmode ) console.log( 'Log CATCH ERROR %o', e )
			self.userName = 'USERNAME';
			self.userMCO = 'USERMCO';
			self.userEmail = 'USEREMAIL';
		}
	}
	
	self.getName = function(  )
	{
		if ( devmode ) console.log( 'Log: GET NAME ' + self.userName );
		return self.userName;
	};
	self.getMCO = function(  )
	{
		if ( devmode ) console.log( 'Log: GET MCO ' + self.userMCO );
		return self.userMCO;
	};
	self.getEmail = function(  )
	{
		if ( devmode ) console.log( 'Log: GET EMAIL ' + self.userEmail );
		return self.userEmail;
	};
	
	
	self.sendScore = function( goal, score )
	{
		var list_name = "GlobalGoalsChallenge";
		
		if ( devmode ) console.log( 'Log: sendScore()' );
		if ( devmode ) console.log( 'Log: listName: ' + list_name );
		if ( devmode ) console.log( 'Log:  name: ' + self.userName );
		if ( devmode ) console.log( 'Log:  mco: ' + self.userMCO );
		if ( devmode ) console.log( 'Log:  goal: ' + goal );
		if ( devmode ) console.log( 'Log:  score: ' + score );
		
		
		var values = [];
		
		values.push( ["WorkEmail", self.userEmail] );
		values.push( ["Title", self.userName] );
		values.push( ["MCO", self.userMCO] );
		values.push( ["Score", score] );
		values.push( ["GlobalGoal", goal] );
		try {
			// ACTION
			$().SPServices({
				operation: "UpdateListItems",
				async: false,
				batchCmd: "New",
				listName: list_name,
				valuepairs: values
			});
		}
		catch (e) {
		   if ( devmode ) console.log( 'Log CATCH ERROR %o', e )
		}

	};
	
	self.getValues();
}




/*

function getSPUserDetails() {
	    $().SPServices({
		    operation: "GetUserProfileByName",
		    async: false,
		    AccountName: $().SPServices.SPGetCurrentUser(),
		    completefunc: function (xData, Status) {
		    
			    $(xData.responseXML).find("PropertyData > Name").each(function() {
			    if($(this).text() == 'unileverMRDMCO'){
			      	userMCO = $(this).parent().find("Values").text();
			      	}
			    if($(this).text() == 'UserName'){
			      	userName = $(this).parent().find("Values").text();
			      	}
			    if($(this).text() == 'WorkEmail'){
			      	userEmail = $(this).parent().find("Values").text();
			      	}
			    });
			}
	  	});
		$("input[name=user_name]").val(userName);
		$("input[name=mco_region]").val(userMCO);
	}

function writeSPList(){
		var userScore = $("input[name=score]").val();
		var userGlobalGoal = $("#user_goal").val();

			    $().SPServices({
        operation: "UpdateListItems",
        async: false,
        batchCmd: "New",
        listName: "game",
        valuepairs: [["WorkEmail", userEmail],["Title", userName],["MCO", userMCO],["Score", userScore],["GlobalGoal",userGlobalGoal]],
    });
}
*/
