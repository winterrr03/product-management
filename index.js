const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require("moment");
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser(process.env.COOKIE_CODE));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);

app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
      pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});