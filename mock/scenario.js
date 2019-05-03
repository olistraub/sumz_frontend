var utils = require('./utils');

exports.routes = [{
  route: '/scenarios',
  verb: 'GET',
  handler: function (req, res) {
    res.json(state.scenarios);
  },
},
{
  route: '/scenarios',
  verb: 'POST',
  handler: function (req, res) {
    req.body.id = Math.round(Math.random() * 99999);
    state.scenarios.push(req.body)
    res.send(req.body.id + '');
    res.status(201);
  },
},
{
  route: '/scenarios/:sId',
  verb: 'GET',
  handler: function (req, res) {
    var scenario = utils.getById(req.params.sId, state.scenarios);
    res.json(scenario);
  },
},
{
  route: '/scenarios/:sId',
  verb: 'PUT',
  handler: function (req, res) {
    utils.setById(req.params.sId, state.scenarios, req.body);
    res.send(req.body.id + '');
    res.type("application/text");
  }
},
{
  route: '/scenarios/:sId',
  verb: 'DELETE',
  handler: function (req, res) {
    var sId = parseInt(req.params.sId);
    state.scenarios.splice(
      utils.findIndex(state.scenarios, function (scenario) {
        return scenario.id === sId;
      }),
      1);
    res.send(true);
  }
}
];
