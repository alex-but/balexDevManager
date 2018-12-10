const express = require('express')
const bodyParser = require('body-parser');

//TODO: remove jade if unnecesary
//app.engine('jade', require('jade').__express)
//app.set('view engine', 'jade')

//Init express server
var app = express()
//Extend app with websock capabilities
var expressWs = require('express-ws')(app)

// Middleware
// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//app.use(require('./middlewares/users'))

//add routes
app.use(require('./routes'))

//Set Public Folder
app.use(express.static(__dirname + '/public'))

app.listen(3000, function() {
  console.log('Listening on port 3000...')
})
