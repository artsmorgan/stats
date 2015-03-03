/*
* @object URL holds a list for url's constant
* @return {}
*/
exports.url = function(req, res){ 
	var nbaSeason = '2014-15';

	var currentDate = new Date();
	var month = (currentDate.getMonth() + 1)
		month = (month>=10) ? month : '0'+month;

	var day = currentDate.getDay()+1;
		day = (day>=10) ? day : '0'+day;
	
	var date = month+''+day;	

	return {
		nba: {
			root: "http://www.nba.com",
			teamList: "http://www.nba.com/teams/?ls=iref:nba:gnav",
			//teamRoster requires teamId
			teamRoster: "http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season="+nbaSeason+"&TeamID=",
			schedule: "http://data.nba.com/jsonp/5s/json/cms/noseason/scores/gametracker.json?callback=cb",
			playerList: "http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season="+nbaSeason,

		},
		nbaEspn: {
			root: "http://espn.go.com/nba/",
			teams: "http://espn.go.com/nba/teams",
			teamRoster: "http://espn.go.com/nba/team/roster/_/name/", // +team acr. ex: + "bos"
			schedule: "http://espn.go.com/nba/schedule",
			playerInfo: "http://espn.go.com/nba/player/splits/_/id/", // + playerId, ex: + 3992
			playerLogs: "http://espn.go.com/nba/player/gamelog/_/id/" // + playerId, ex: + 3992
		},
		nbaCbs:{
			schedule: "http://www.cbssports.com/nba/schedules/day/"+date+"/regular"
		}
	};
};