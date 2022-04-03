const db = require('quick.db')
const url = require("url");
const ejs = require("ejs");
const path = require("path");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Permissions, MessageEmbed } = require("discord.js");
const Strategy = require("passport-discord").Strategy;
const app = express();
const MemoryStore = require("memorystore")(session);
module.exports = async (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));


  let domain;
  let callbackUrl;

  try {
    const domainUrl = new URL(client.config.dashboard.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol,
    };
  } catch (e) {
    console.log(e);
    throw new TypeError("Invalid domain specific in the config file.");
  }

  if (client.config.dashboard.usingCustomDomain) {
    callbackUrl = `${domain.protocol}//${domain.host}/callback`;
  } else {
    callbackUrl = `${domain.protocol}//${domain.host}:${client.config.dashboard.port}/callback`;
  }
  passport.use(
    new Strategy(
      {
        clientID: client.config.bot.clientID,
        clientSecret: client.config.bot.clientSecret,
        callbackURL: callbackUrl,
        scope: ["identify", "guilds"],
      },
      (accessToken, refreshToken, profile, done) => {
        // On login we pass in profile with no logic.
        process.nextTick(() => done(null, profile));
      },
    ),
  );
  app.use(
    session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret:
				"#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    }),
  );

  // We initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  // We bind the domain.
  app.locals.domain = client.config.dashboard.domain.split("//")[1];
  app.engine("ejs", ejs.renderFile);
  app.set("view engine", "ejs");
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use("/", express.static(path.resolve(`${dataDir}${path.sep}assets`)));

  // We declare a renderTemplate function to make rendering of a template in a route as easy as possible.
  const renderTemplate = (res, req, template, data = {}) => {
    // Default base data which passed to the ejs template by default.
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null,
    };
    res.render(
      path.resolve(`${templateDir}${path.sep}${template}`),
      Object.assign(baseData, data),
    );
  };

  // We declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect him.
  const checkAuth = (req, res, next) => {
    // If authenticated we forward the request further in the route.
    if (req.isAuthenticated()) return next();
    // If not authenticated, we set the url the user is redirected to into the memory.
    req.session.backURL = req.url;
    // We redirect user to login endpoint/route.
    res.redirect("/login");
  };

  // Login endpoint.
  app.get(
    "/login",
    (req, res, next) => {
      // We determine the returning url.
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      // Forward the request to the passport middleware.
      next();
    },
    passport.authenticate("discord"),
  );

  // Callback endpoint.
  app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    /* We authenticate the user, if user canceled we redirect him to index. */ (
      req,
      res,
    ) => {
      // If user had set a returning url, we redirect him there, otherwise we redirect him to index.
      if (req.session.backURL) {
        const backURL = req.session.backURL;
        req.session.backURL = null;
        res.redirect(backURL);
      } else {
        res.redirect("/");
      }
    },
  );

  // Logout endpoint.
  app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  app.get("/invite", function(req, res) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&response_type=code&redirect_uri=${encodeURIComponent(`${client.config.dashboard.domain}/callback`)}&scope=bot&permissions=8`);
  });

  // Index endpoint.
  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs", {
      discordInvite: client.config.general.invite,
    });
  });

  app.get("/status", (req, res) => {
    renderTemplate(res, req, "status.ejs", {
      discordInvite: client.config.general.invite,
    });
  });

  app.get("/status", (req, res) => {
    renderTemplate(res, req, "docs.ejs", {
      discordInvite: client.config.general.invite,
    });
  });


  app.get("/userinfo", checkAuth, (req2, res) => {
    renderTemplate(res, req2, "userinfo.ejs", {
      discordInvite: client.config.general.invite,
    });
  });


  // Dashboard endpoint.
  app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", { perms: Permissions });
  });

  // Settings endpoint.
  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return res.redirect("/dashboard");
    }
    renderTemplate(res, req, "settings.ejs", {
      guild,
      alert: null,
    });
  });

  // Settings endpoint.
  app.post("/userinfo", checkAuth, async (req2, res) => {
    if (req2.body.theme){
      db.set(`colormode-${req2.user.id}`, `checked`)
    } else {
      db.delete(`colormode-${req2.user.id}`)
    }
    renderTemplate(res, req2, "userinfo.ejs", {
      // settings: storedSettings,
      alert: "Your settings have been saved.",
    });
  })





  app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("ADMINISTRATOR")) {
      return res.redirect("/dashboard");
    }

    // console.log(req.body.enable)
    if (req.body.enable){
        db.set(`everyone-${guild.id}`, `checked`)
    } else {
      db.delete(`everyone-${guild.id}`)
    }


    client.guilds.cache.get(guild.id).setName(req.body.svname)
    client.guilds.cache.get(guild.id).me.setNickname(req.body.nickname)


    if (req.body.prefix){
      const pf = db.fetch(`prefix-${guild.id}`)
      db.set(`prefix-${guild.id}`, req.body.prefix || pf);
    }



    if (req.body.link){
      const link = db.fetch(`link-${guild.id}`)
      db.set(`link-${guild.id}`, req.body.link || link);
    }


    if (req.body.channel){
      client.distube.voices.leave(guild)
      const channel = req.body.channel || await db.get(`channel-${guild.id}`)
      db.set(`channel-${guild.id}`, req.body.channel || channel);
      const ch = await guild.channels.cache.get(channel)
      const link = await db.get(`link-${guild.id}`) || client.config.general.link
      client.distube.play(ch, link, {
        member: member,
        textChannel: guild.channels.cache.get('959444174485221386'),
        guild
      }).catch(e=>{return})
    }


    if (req.body.volume){
      const queue = client.distube.getQueue(guild)
      const volume = parseInt(req.body.volume)
      if (isNaN(volume)){
        return renderTemplate(res, req, "settings.ejs", {
          guild,
          alert: "Must provide a number",
        })
      } else if (volume > 100 || volume < 0){
        return renderTemplate(res, req, "settings.ejs", {
          guild,
          alert: "Volume must be 0-100",
        })
      } else {
          try {
            queue.setVolume(volume).catch(e=>{return})
          } catch (error) {
            return
          }
      }
    }


    
    renderTemplate(res, req, "settings.ejs", {
      guild,
      // settings: storedSettings,
      alert: "Your settings have been saved.",
    });
  });

  app.listen(client.config.dashboard.port, null, null,);
};
