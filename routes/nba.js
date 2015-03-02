
/*
 * N B A    R O U T I N G
 */
 
//Url loader Dependency
var nbaUrl = require('./../utils/url');
var URL = nbaUrl.url().nba;
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
exports.teamList = function(req, res){
  var teamList = [];
	curl.request(URL.teamList, function (err, data) {
		$ = cheerio.load(data);
		var dataContainer = $('#nbateamsTable').find('.nbaEachTeamTbl');			
		
		$(dataContainer + ' > tbody > tr').each(function() {
			var name = $(this).find('.nbateamname').text().trim();
			var img = $(this).find('.nbaImgPad').attr('src');
				//Some images are provide from cdn other ones from localfolder					
				img = (img!=undefined && img.indexOf('cdn')>0) ? img : URL.root+img;

			if( name!='' && img!=undefined)
				teamList.push({ name:name, image:img });
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
	curl.request(URL.teamRoster+teamId, function (err, data) {
		var json  = JSON.parse(data);
		res.send(json.resultSets);
	});
};

/*
* @method nba.schedule return a list for current games 
* @return JSON response
*/
exports.schedule = function(req, res){
	var scheduleList = [];
	curl.request(URL.schedule, function (err, data) {
		var parse = data.replace('cb(','');
			parse = parse.slice(0, -2);
		var json  = JSON.parse(parse);
		var root  = json.sports_content;
		var games = root.game;
		var gamesArr = [];

		games.forEach(function(item){
			gamesArr.push({
				nba_id: item.id,
				nba_season_id: item.season_id,
				date: item.date,
				time: item.time,
				arena: item.arena,
				city: item.city,
				visitor: item.visitor,
				home: item.home
			});
		});

		scheduleList.push({ 
			metadata: root.sports_meta.season_meta,
			games: gamesArr
		 });
		res.send(scheduleList);
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

/*
* @method nba.players return stats for a specific player
* @params playerId [INT]
* @return JSON response
*/
exports.players = function(req, res){
  res.send("respond with a resource");
};

