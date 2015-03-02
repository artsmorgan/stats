//Class API Method
/*
* @object NBA holds a list for API's NBA end points
* @return {}
*/
exports.nba = function(req, res){ 
	return {
		root: "/nba",
		nba: [
			{
				route: "/",
				methodsAllowed: "GET",
				params: "",
				responseType: "JSON",
				description: "List methods allowed"
			},
			{
				route: "/teams",
				methodsAllowed: "GET",
				params: "",
				responseType: "JSON",
				description: "Team List"
			},
			{
				route: "/teams/:teamId",
				methodsAllowed: "GET",
				params: "teamId",
				responseType: "JSON",
				description: "List stats for a specific team"
			},
			{
				route: "/",
				methodsAllowed: "GET",
				params: "teamId",
				responseType: "JSON",
				description: "List stats for a specific team"
			}
		]
	}
};