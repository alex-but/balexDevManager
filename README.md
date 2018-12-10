###Project structure.
I was inspired by this article: https://www.terlici.com/2014/08/25/best-practices-express-structure.html

balexDevManager/
  controllers/
    devices.js
    index.js
    users.js
  helpers/
  middlewares/
    auth.js
    users.js
  models/
    device.js
    user.js
  public/
    libs/
    css/
    img/
  views/
    devices/
      device.jade
    users/
    index.jade
  tests/
    controllers/
    models/
      device.js
    middlewares/
    integration/
    ui/
  app.js

###Database structure:
users: 
  {
    uid1:
    {
      username: username;
      Name: name;
    },
    ....
  }
devices:
  {
    did1:
    {
      uid: uid;
      Name:
      Type:
      Status:
    },
    ....
  }

###HTTP API

Users
==========
POST      /users/register
DELETE    /users/:uid
GET       /users/:uid
GET       /users/:uid/devices

Devices
=========
POST      /devices/add
DELETE    /devices/:did
GET       /devices/:did
POST      /devices/:did/setstate
GET       /devices/:did/state
POST      /devices/:did/reqstate
GET       /devices/:did/reqstate


###Websocket API

Users
=====


Devices
=========
