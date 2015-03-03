
/*
 * N B A    R O U T I N G
 */

//Url loader Dependency
var nbaUrl = require('./../utils/url');
var URL = nbaUrl.url().nbaEspn;
//Api Documentation
var apiDoc = require('./../utils/apiDoc');
//Curl Request Dependency
var curl = require('curlrequest');
//DOM Depency
var cheerio = require('cheerio')


/*
* @method nba.index list the posible methods for NBA API
* @return JSON response
*/
exports.index = function(req, res){	
	res.send(apiDoc.nba());
};


/*
* @method nba.teamList return al the teams of NBA
* @return JSON response
*/
exports.teams = function(req, res){
  var teamList = [];
	curl.request(URL.teams, function (err, data) {
		$ = cheerio.load(data);
		var dataContainer = $('.mod-table').find('.span-2');
		
		$(dataContainer).each(function() {			
			var conference = $(this).find('h4').text();
			var teamContainer = $(this).find('ul');
			
			console.log(conference)
						
			teamContainer = $(this).find('.logo-nba-medium');

			$(teamContainer).each(function(){
				var name = 	$(this).find('h5').text();
				var acrn = $(this).attr('class');
				var lastThree = acrn.substr(acrn.length - 3);
				teamList.push({
					name: name,
					acrn: lastThree
				})
			});
		});
	    res.send(teamList);
	});
};

/*
* @method nba.team  return detail info for a specifict team
* @params teamId [INT]
* @return JSON response
*/
exports.teamInfo = function(req, res){
  res.send("respond with a resource");
};


/*
* @method nba.teamRoster return a player list for a specific team
* @params teamId [INT]
* @return JSON response
*/
exports.teamRoster = function(req, res){
	var teamId = req.params.teamId;
	var players = [];
	curl.request(URL.teamRoster+teamId, function (err, data) {
		$ = cheerio.load(data);
		var mainContainer = $('#content');
		var teamName = mainContainer.find('.logo').text();		
		var playerList = mainContainer.find('#my-players-table');		

		var tableContent = playerList.find('.mod-content');
		var playerTable = tableContent.find('table');
		var tr = playerTable.find('tr');		
		$(tr).each(function(){	
			var clazz = $(this).attr('class');
			if(clazz != 'stathead' && clazz != 'colhead' && clazz != 'total'){
				var playerId = clazz.split(' ');
					//expected format =  player-46-3468
					playerId = playerId[1].split('-');
					playerId = playerId[playerId.length-1];

				var td = $(this).find('td');							
				var name, number, position, age, ht, wt, college, sallary;
				$(td).each(function(i,obj){
					var text = $(this).text();
					switch(i){
						case 0:
							number = text;
							break
						case 1:
							name = text;
							break
						case 2:
							position = text;
							break
						case 3:
							age = text;
							break
						case 4:
							ht = text;
							break
						case 5:
							wt = text;
							break
						case 6:
							college = text;
							break						
						case 7:
							sallary = text;
							break;							
					}
				});
				players.push({
					id: playerId,
					name: name,
					number: number,
					position: position,
					age: age,
					ht: ht,
					wt: wt,
					college: college,
					sallary: sallary,
					team: teamName
				})
			}
			
		});
		res.send(players);
	});
};

/*
* @method nba.schedule return a list for current games 
* @return JSON response
*/
exports.schedule = function(req, res){
	var scheduleList = [];
	curl.request(URL.schedule, function (err, data) {
		$ = cheerio.load(data);
		var content =  $('#my-teams-table').find('table');
			content = $(content);
		var schedule = [];
		
		content.each(function(i,obj){			
			var tr = $(this).find('tr');
			var status;
			
			tr.each(function(i,obj){

				var self = $(this);
				var text = self.text();				
				
				var td = $(this).find('td');				
					td.each(function(i,obj){
						console.log($(this).text());
					});
				//if(self.attr('class')=='')
			});

			scheduleList.push(schedule);
			
		})
		res.jsonp(scheduleList);
	});
};


/*
* @method nba.playersList return a complete player list 
* @return JSON response
*/
exports.playersList = function(req, res){  
	curl.request(URL.playerList, function (err, data) {
		var json  = JSON.parse(data);
		res.send(json);
	});	
};

exports.playersLog = function(req,res){
	var playerId = req.params.playerId;
	var logs = [];
	curl.request(URL.playerLogs+playerId, function (err, data) {
			$ = cheerio.load(data);
			var container = $('.mod-player-stats');
			var date, opponent, score,minutes,points,rebounds,assists,blocks,steals,turnovers,fantasyPoints;
			var tr = $(container + '.mod-content table').find('tr');	
				tr.each(function(i){
					var myClass = $(this).attr('class');
					console.log(myClass);
					if(myClass!='stathead' && myClass!='colhead' && myClass!='total'){
						var td = $(this).find('td');
							td.each(function(i){
								var text = $(this).text();
								console.log(i + " " + text);
								switch(i){
									case 0:
										date = text;
										break;
									case 1:
										opponent = text;
										break;	
									case 2:
										score = text;
										break;		
									case 3:
										minutes = text;
										break;		
									case 10:
										rebounds = text;
										break;
									case 11:
										assists = text;
										break;
									case 12:
										blocks = text;
										break;		
									case 13:
										steals = text;
										break;
									case 15:
										turnovers = text;
										break;		
									case 16:
										points = text;
										break;		
								}
						});
						logs.push({
							date: date,
							opponent: opponent,
							score: score,
							minutes: minutes,
							points:points,
							rebounds:rebounds,
							assists: assists,
							blocks:blocks,
							steals:steals,
							turnovers:turnovers,
							fantasyPoints:"n-a"
						});
					}
					if(myClass=='total') return false;
				});
			//breaks if tr class = total	
			res.send(logs);							
		});
};

/*
* @method nba.players return stats for a specific player
* @params playerId [INT]
* @return JSON response
*/
exports.players = function(req, res){
  	var playerId = req.params.playerId;
  	var playerInfo = [];
	curl.request(URL.playerInfo+playerId, function (err, data) {
		$ = cheerio.load(data);
		var name, number, position,team, games, points, rebounds, assists, blocks,steals,turnovers,weigth,split_position;
		var playerMainContainer = $('.mod-page-header');
		var generalInfo = playerMainContainer.find('.general-info').find('li');
			
			generalInfo.each(function(i,obj){				
				var text = $(this).text();		
				switch(i){
					case 0:
						split_position = text;
						break;
					case 1:
						weigth = text;
						break;
					case 2:
						team = text;
						break;		
				}
			});
					
			split_position = split_position.split(' ');
			number = split_position[0];
			position = split_position[1];
			name = playerMainContainer.find('h1').text();
			
	

		var tableHead = $('.tablehead').find('.total').find('td');			
			tableHead.each(function(i){				
				var text = $(this).text();
				switch(i){
					case 1:
						games = text;
						break;
					case 30:
						assists = text;
						break;	
					case 31:
						blocks = text;
						break;	
					case 32:
						steals = text;
						break;	
					case 34:
						turnovers = text;
						break;	
				}
			})

		
		playerInfo.push({
			id:playerId,
			name:name,
			number:number,
			position: position,
			team:team,
			weigth:  weigth,
			summary:{
				gamesPlayed: games,
				points: points,
				rebounds: rebounds,
				assists: assists,
				blocks:blocks,
				steals: steals,
				turnovers: turnovers
				}
			});
		res.send(playerInfo);
	});
};

