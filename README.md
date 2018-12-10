# balexDevManager
Node JS IoT device manager backend server using Express JS and Redis DB

## Getting Started
install redis  
run redis instance  
clone repository  
go to folder  
```
npm install
node app.js
```

## Project structure.

balexDevManager/  
  routes/  
    devices.js  
    index.js  
    users.js  
  config/
    redis.js  
    passport.js  
  middlewares/  
  models/  
    device.js  
    user.js  
  public/   
    index.html
  tests/  
  app.js  

## HTTP API

### Users
POST      /users/register  
DELETE    /users/:uid  
GET       /users/:uid  
GET       /users/:uid/devices  

### Devices
POST      /devices/add  
DELETE    /devices/:did  
GET       /devices/:did  
POST      /devices/:did/setstate  
GET       /devices/:did/state  
POST      /devices/:did/reqstate  
GET       /devices/:did/reqstate  


## Websocket API

### Users
to be added

### Devices
to be added

## Database structure
to be added
