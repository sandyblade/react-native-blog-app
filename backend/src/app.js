/**
 * This file is part of the Sandy Andryanto Blog Application.
 *
 * @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('./utils/jwt');
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const db = require("./models");
const PORT = process.env.APP_PORT || 8000;
const fs = require('fs');
const dir = './uploads';
const socketHandler = require("./controllers/socket.controller.js")

app.use('*/uploads',express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

io.on('connection', function(socket){
  console.log('A user connected');

  socket.on('/notification/call', async (token) => {
    const response = await socketHandler.notification(token)
    socket.emit('/notification/list', response);
  });

  socket.on('/comment/article/call', async (slug) => {
    const response = await socketHandler.comment(slug)
    socket.emit('/comment/article/list', response);
  });
  
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });

});

app.get("/", (req, res) => {
  res.sendStatus(404);
});

app.use(function(err, req, res, next) {
  if(err.status !== undefined && err.status != 200)
    res.status(err.status).send({error : err.message});
})

server.listen(PORT, () => {
  db.sequelize.sync();
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  console.log("Starting Application "+new Date().toString());
});

app.set('io', io);

module.exports = app