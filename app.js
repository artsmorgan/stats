
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var nba = require('./routes/nba');
var nbaEspn = require('./routes/nbaEspn');
var nbaCbs = require('./routes/nbaCbs');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/********* R O U T E S *********/
app.get('/', routes.index);

/********* N B A *********/
/*app.get('/nba', nba.index);
app.get('/nba/teams',nba.teamList);
app.get('/nba/teams/:teamId/roster',nba.teamRoster); //List players by team (team roster)
//app.get('/nba/teams/:teamId/gamelogs',nba.playersListByTeam); //Show team logs from previus games
//app.get('/nba/teams/:teamId/stats',nba.playersListByTeam); //show team stats
//app.get('/nba/teams/:teamId/info',nba.playersListByTeam); //show team basic info
app.get('/nba/schedules',nba.schedule);
app.get('/nba/players', nba.playersList);
app.get('/nba/players/:playerId', nba.players);*/

/********* N B A  -  E S P N *********/
app.get('/nba/teams',nbaEspn.teams);
app.get('/nba/teams/:teamId/roster',nbaEspn.teamRoster); //List players by team (team roster)
app.get('/nba/schedules',nbaCbs.schedule);
app.get('/nba/players/:playerId',nbaEspn.players);
app.get('/nba/players/:playerId/logs',nbaEspn.playersLog);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
