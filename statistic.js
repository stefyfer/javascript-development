var url = '';
if (opc == "senate") {
	url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}
else if (opc == "house") {
	url = "https://api.propublica.org/congress/v1/113/house/members.json";
}
var app = new Vue({
	el: "#app",
	data: {
		miembros: [],
		statistic: {},
	}
});
fetch(url, {
	method: 'GET',
	headers: new Headers({
		"X-API-Key": "j3bfB549PzDAGuFbT08eXZDDmJgkq1WXNvJ6nqbj"
	})
}).then(function (response) {
	return response.json();
}).then(function (json) {
	app.miembros = json.results[0].members;
	estadisticas.partys[0].members = filtrarMembers(app.miembros)[0];// Me devuelve solamente los democratas 
	estadisticas.partys[1].members = filtrarMembers(app.miembros)[1];// Me devuelve solamente los republicanos
	estadisticas.partys[2].members = filtrarMembers(app.miembros)[2];// Me devuelve solamente los independientes 
	estadisticas.partys[0].percentvotesWparty = FiltrarPercentVotesWithParty(estadisticas.partys[0].members).toFixed(2);// Me devuelve solamente los democratas 
	estadisticas.partys[1].percentvotesWparty = FiltrarPercentVotesWithParty(estadisticas.partys[1].members).toFixed(2);// Me devuelve solamente los republicanos
	estadisticas.partys[2].percentvotesWparty = FiltrarPercentVotesWithParty(estadisticas.partys[2].members).toFixed(2);// Me devuelve solamente los independientes 
	let members = app.miembros;
	estadisticas.mostEngaged = Engaged(ordenararray(members));
	estadisticas.leastEngaged = Engaged(ordenararray2(members));
	estadisticas.mostLoyal = Engaged(ordenararray4(members));
	estadisticas.leastLoyal = Engaged(ordenararray3(members));
	estadisticas.totalmembers = members.length;
	if (isNaN(FiltrarPercentVotesWithParty(estadisticas.partys[2].members))) {
		let totalpercent = FiltrarPercentVotesWithParty(estadisticas.partys[0].members) + FiltrarPercentVotesWithParty(estadisticas.partys[1].members);
		estadisticas.totalprompercent = (totalpercent / 2).toFixed(2);
	}
	else {
		let totalpercent = FiltrarPercentVotesWithParty(estadisticas.partys[0].members) + FiltrarPercentVotesWithParty(estadisticas.partys[1].members) + FiltrarPercentVotesWithParty(estadisticas.partys[2].members);
		estadisticas.totalprompercent = (totalpercent / 3).toFixed(2);
	}
	app.statistic = estadisticas;
}).catch(function () {
	if (app.miembros == undefined) {
		console.log("Fail");
	} else {
	}
});
var estadisticas = {
	"partys": [
		{
			"party": "D",
			"description": "Democrats",
			"members": [],
			"percentvotesWparty": 0,
		},
		{
			"party": "R",
			"description": "Republicans",
			"members": [],
			"percentvotesWparty": 0,
		},
		{
			"party": "I",
			"description": "Independents",
			"members": [],
			"percentvotesWparty": 0,
		}
	],
	"leastEngaged": [],
	"mostEngaged": [],
	"leastLoyal": [],
	"mostLoyal": [],
	"totalmembers": 0,
	"totalprompercent": 0,
}
function promediomiembros(members) {
	if (isNaN(estadisticas.partys[2].percentvotesWparty)) {
		estadisticas.partys[2].percentvotesWparty = 0;
	}
	let totalpercent = estadisticas.partys[0].percentvotesWparty + estadisticas.partys[1].percentvotesWparty + estadisticas.partys[2].percentvotesWpart;
	let prommiem = 0;
	if (estadisticas.partys[2].percentvotesWparty == 0) {
		prommiem = totalpercent / 2;
	}
	else {
		prommiem = totalpercent / 3;
	};
	return prommiem;
}
function filtrarMembers(data) {
	let democrats = [];
	let republicans = [];
	let independents = [];
	let membersByParty = [];
	data.forEach(member => {
		if (member.party === 'D') {
			democrats.push(member);
		}
		if (member.party === 'R') {
			republicans.push(member);
		}
		if (member.party === 'I') {
			independents.push(member);
		}
	});
	membersByParty.push(democrats);
	membersByParty.push(republicans);
	membersByParty.push(independents);
	return membersByParty;
}
function FiltrarPercentVotesWithParty(members) {
	let total = 0;
	members.forEach(member => {
		total = total + member.votes_with_party_pct;
	});
	return (total / members.length);
}
function ordenararray(array) {  //para el orden ascendiente
	return array.sort(function (a, b) {
		return a.missed_votes_pct - b.missed_votes_pct;
	});
}
function ordenararray2(array) {  //para el orden descendiente
	return array.sort(function (a, b) {
		return b.missed_votes_pct - a.missed_votes_pct;
	});
}
function ordenararray3(array) {  //para el orden ascendiente
	return array.sort(function (a, b) {
		return a.votes_with_party_pct - b.votes_with_party_pct;
	});
}
function ordenararray4(array) {  //para el orden descendiente
	return array.sort(function (a, b) {
		return b.votes_with_party_pct - a.votes_with_party_pct;
	});
}
function Engaged(array) {
	let arraylength = array.length;
	let diezporciento = Math.round(10 * arraylength) / 100;
	var array1 = [];
	for (var i = 0; i < array.length - 1; i++) {
		if (array1.includes(array[i]) == false) {
			while (i < diezporciento) {
				array1.push(array[i]);
				i++;
			}
		}
	}
	return array1;
}