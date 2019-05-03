scenario = require('./scenario');

function setDefaultHeaders(forHandler, req, res) {
  res.type('application/json');
  res.status(200);
  return forHandler(req, res);
}

scenario.routes.forEach(function (routeDefinition) {
  Sandbox.define(
    routeDefinition.route,
    routeDefinition.verb,
    function (req, res) {
      setDefaultHeaders(routeDefinition.handler, req, res);
    });
});

// request tokens
Sandbox.define('/oauth/token', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/x-www-form-urlencoded')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  // Send the response body.
  res.json(
    {
      access_token: "214vg3hg2v123f123f4ghv",
      refresh_token: "dfshbfhb367gfvagfasf",
      token_type: "bearer",
      expires_in: 1234,
      scope: "read write",
      jti: "",
      id: 1,
    }
  );
  return;
})

// Registration
Sandbox.define('/users', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200); //should be 302

  res.json(
    {

    }
  );

})

// Resetpassword
Sandbox.define('/users/{id}', 'PUT', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  res.json(
    {

    }
  );

})

// request new password
Sandbox.define('/users/forgot', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  res.json(
    {

    }
  );
})

// set new password after requesting a new one
Sandbox.define('/users/reset/token', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  res.json(
    {

    }
  );

})

// Delete user
Sandbox.define('/users/{id}/delete', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  res.json(
    {

    }
  );

})
