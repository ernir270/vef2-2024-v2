import express from 'express';
import passport from 'passport';
import { insertGame, getGames, getTeams } from '../lib/db.js';

export const adminRouter = express.Router();

async function indexRoute(req, res) {
  return res.render('login', {
    title: 'Innskráning',
  });
}

async function adminRoute(req, res) {
  const games = await getGames();
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();

  return res.render('admin', {
    user,
    games,
    loggedIn,
  });
}

// TODO færa á betri stað
// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /login
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

async function skraRoute(req, res) {
  const teams = await getTeams();

  return res.render('skra', {
    title: 'Skrá leik',
    teams
  });
}

const logoutRoute = (req, res) => {
  req.logout((err) => {
    if(err){
      console.error(err);
    }
    return res.redirect('/');
  });
}

function skraRouteInsert(req, res) {
  // TODO mjög hrátt allt saman, vantar validation!
  const { HOME_ID, AWAY_ID, HOME_SCORE, AWAY_SCORE } = req.body;
  insertGame(HOME_ID, HOME_SCORE, AWAY_ID, AWAY_SCORE);
  res.redirect('/admin');
}

adminRouter.get('/login', indexRoute);
adminRouter.get('/admin', ensureLoggedIn, adminRoute);
adminRouter.get('/skra', ensureLoggedIn, skraRoute);
adminRouter.post('/skra', skraRouteInsert);
adminRouter.post('/logout', logoutRoute);

adminRouter.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);
