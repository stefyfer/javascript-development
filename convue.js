// Traigo la variable para ver que listado utilizo
var url = '';

if (opc == "senate") {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else {
    url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

const app = new Vue({
    el: "#app",
    data: {
        miembros: [],
        miembrosFiltered: [],
        listState: 'All',
    },
    methods: {
        filter: function () {
            console.log("hello word");

            let checkValues = document.querySelectorAll('input[name=party]:checked')
            checkValues = Array.from(checkValues)
            checkValues = checkValues.map(elt => elt.value)
            console.log(checkValues)

            let state = document.querySelector("select").value
            console.log(state)
            var listaFiltrada = this.miembros.filter(members => checkValues.includes(members.party) &&
                (state == "All" ? true : members.state == state));
            console.log(listaFiltrada);
            this.miembrosFiltered = listaFiltrada;
        },
    },
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
    app.miembrosFiltered = json.results[0].members;
    filter(json.results[0].members);
}).catch(function () {
    if (app.miembros == undefined) {
        console.log("Fail");
    } else {
    }
})

