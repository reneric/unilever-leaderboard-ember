function DatabaseConnection()
{
	var self = this;

	self.mode = 'production'; // none / mock / debug / production

	self.sendScore = function( user_data_object, success_function )
	{
		console.log( 'Log Sending Scores: %o', user_data_object )

		var request = new XMLHttpRequest();

		var request_address = null;

		switch( self.mode )
		{
			case "mock": request_address = 'https://private-anon-c0ea1d31b1-unileverleaderboard.apiary-mock.com/entries/';
				break;
			case "debug": request_address = 'https://private-anon-c0ea1d31b1-unileverleaderboard.apiary-proxy.com/entries/';
				break;
			case "production": request_address = 'https://unilever-leaderboard-api.herokuapp.com/entries/';
				break;
			default: console.log('request address not set');
				break;
		}

		if( request_address )
		{
			request.open('POST', request_address )

			request.setRequestHeader('Content-Type', 'application/json');
			request.setRequestHeader('Authorization', 'Token notasecrettoken');

			request.onreadystatechange = function () {
			  if (this.readyState === 4) {
				console.log('Status:', this.status);
				console.log('Headers:', this.getAllResponseHeaders());
				console.log('Body:', this.responseText);
				if( this.status == 201 )
				{
					console.log( 'Log SUCCESS' )
					success_function();
				}
			  }
			};

			var body = {
			  'name': user_data_object.name,
			  'email': user_data_object.email,
			  'event': user_data_object.event,
			  'score': user_data_object.score
			};

			request.send(JSON.stringify(body));
		}
		else
		{
			success_function();
		}

	};

}


