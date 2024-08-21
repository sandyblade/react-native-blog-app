/**
 * This file is part of the Sandy Andryanto Company Profile Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto404@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

const express = require("express");
const bodyParser = require("body-parser"); /* deprecated */
const jwt = require('./helpers/jwt');
const cors = require("cors");
const all_routes = require('express-list-endpoints');
const app = express();
var db = require("./models");

app.use('*/uploads',express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


require("./routes")(app);

app.get("/", (req, res) => {
  res.sendStatus(404);
});

const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(all_routes(app))
});

module.exports = app