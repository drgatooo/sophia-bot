const app = require("express")(),
  path = require("path"),
  exphbs = require("express-handlebars"),
  fs = require("fs"),
  express = require("express"),
  passport = require("passport"),
  { Strategy } = require("passport-discord"),
  bp = require("body-parser");

//-- settings
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.use(
  require("express-session")({
    secret: "sophia-web",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", ".hbs");
app.use(passport.initialize()).use(passport.session());
app.use((req, _, next) => {
  req.Client = require("../index.js");
  next();
});
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new Strategy(
    {
      clientID: "912140482904203275", //864930156857786388
      clientSecret: "f7tgfZ0Gqz1j9IzJG5rLqr-dF1p3IoyN", //3imTR2rK_wUvyaW5qz6HMXwQp6E7BU-f
      callbackURL: "http://localhost:3000/login",
      scope: ["identify", "guilds"],
    },
    (a, b, profile, cb) => {
      process.nextTick(() => {
        return cb(null, profile);
      });
    }
  )
);

//-- static files
app.use(express.static(path.join(__dirname, "public")));

//-- routes
for (let file of fs.readdirSync(path.join(__dirname, "routes"))) {
  app.use(require("./routes/" + file));
}
//-- Error page
app.use((_, res) => {
  res.status(404).render("404");
});

//-- listen
app.listen(app.get("port"), () => {
  console.log("Server listo en el puerto: " + app.get("port"));
});
