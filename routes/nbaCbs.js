
/*
 * N B A    R O U T I N G
 */

//Url loader Dependency
var nbaUrl = require('./../utils/url');
var URL = nbaUrl.url().nbaCbs;
//Api Documentation
var apiDoc = require('./../utils/apiDoc');
//Curl Request Dependency
var curl = require('curlrequest');
//DOM Depency
var cheerio = require('cheerio')

/*
* @method nba.schedule return a list for current games 
* @return JSON response
*/
exports.schedule = function(req, res){
	var scheduleList = [];
	curl.request(URL.schedule, function (err, data) {
		$ = cheerio.load(data);
		var content =  $('.data');			
		var schedule = [];
		
		var date, time, away,home, arena;
		var tr = content.find('tr');
			tr.each(function(i,obj){
				var trClass = $(this).attr('class');
				var that = $(this);

				if(trClass!='label'){
					
					if(trClass=='title'){
						date = that.text();
					}else{
						var td = that.find('td');
						td.each(function(i,obj){
							var text = $(this).text();
							var _td = $(this);
							switch(i){
								case 0:
									away = text;
									break;
								case 1:
									home = text;
									break;	
								case 2:
									time = _td.find('.gmtTime').attr('data-gmt');
									break;
								case 3:
									arena = text;
									break	
							}
						});
						if(trClass!='title' && trClass!='lable'){
							schedule.push({
								away: away,
								home: home,
								time: time,
								arena:arena,
								date: date
							});
						}
					}	
				}
				

			});		
		 res.jsonp(schedule);
		// res.send('<table>'+content.html()) + '</table>';
		//res.send('<table>'+content.html() + '</table>');
	});
};
