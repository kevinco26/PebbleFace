
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var patients = ["Kevin", "Jim", "Ariane", "Estrella"];
var medicines = {
    "Kevin" : 
        {
        "success":{"total":1},
        "medContents":[{"med1":"hola"},{"med1":"comoestas"}],
        "contents":[{"medicine":"Atamel"},{"hour":11},{"minutes":46},{"weekday":"sunday"},{"medicine":"Tylenol"},{"hour":11},{"minutes":47},{"weekday":"sunday"}]
        //"Atamel": { "frequency" : "twice a day", "lastTaken" : "2015-03-27T12:44:26.672Z" },
        //"Tylenol": {"frequency" : "daily", "lastTaken" : "2015-03-27T12:32:26.672Z" }
        },
    "Alan" : 
        {
        "success":
        {"total":1},"contents":{"medicine":"Aspirin","Hour":2,"Minutes":58,"weekday":"sunday"}

    }   
};
server.route({
    method: 'GET',
    path: '/{name}/medicine',
    handler: function (request, reply) {
        var name = encodeURIComponent(request.params.name);
        reply(medicines[name]);
    }
});

server.route({
    method: 'POST',
    path: '/{name}/{medicine}',
    handler: function (request, reply) {
        var name = encodeURIComponent(request.params.name);
        var med = encodeURIComponent(request.params.medicine);
        var datetime = new Date();
        medicines[name][med].lastTaken = datetime;
        reply('Medicine ' + med + ' was last taken by ' + name + ' on ' + medicines[name][med].lastTaken);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
    var datetime = new Date();
    console.log(datetime);
});