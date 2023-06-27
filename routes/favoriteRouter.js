const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user.beer', 'beers.beer')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                console.log('error', favorite);
                if (favorite) {
                    console.log('error 1');
                    req.body.forEach(favBeer => {
                        if (!favorite.beers.includes(favBeer._id)) {
                            favorite.beers.push(favBeer._id);
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    console.log('error 2');
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            req.body.forEach(favBeer => {
                                if (!favorite.beers.includes(favBeer._id)) {
                                    favorite.beers.push(favBeer._id);
                                }
                            });
                            favorite.save()
                                .then(favorite => {
                                    console.log("Favorite has been saved", favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                res.statusCode = 200;
                if (favorite) {
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

favoriteRouter.route('/:beerId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.beerId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.beers.includes(req.params.beerId)) {
                        favorite.beers.push(req.params.beerId);
                        favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('That beer is already in the list of favorites.');
                    }
                } else {
                    Favorite.create({ user: req.user._id, beers: [req.params.beerId] })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end(`PUT operation not supported on /favorties/${res.body._id}`);

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    console.log('In if');
                    console.log("Favorite beers before: ", favorite.beers);
                    favorite.beers = favorite.beers.filter(beer => beer != req.params.beerId)
                    favorite.save()
                        .then(favorite => {
                            console.log(favorite.beers, 'after')
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'applicaton/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'txt/plain');
                    res.end(`Beer ${req.params.beerId} is not a favorite.`);
                }
            })
    });

module.exports = favoriteRouter;