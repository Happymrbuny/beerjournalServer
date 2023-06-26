const express = require('express');
const Beer = require('../models/beer');
const authenticate = require('../authenticate');

const beerRouter = express.Router();

beerRouter.route('/')
    .get((req, res, next) => {
        Beer.find()
            .populate('comments.author')
            .then(beers => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beers);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Beer.create(req.body)
            .then(beer => {
                console.log('Beer created ', beer);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beer);
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /beers');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Beer.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

beerRouter.route('/:beerId')
    .get((req, res, next) => {
        Beer.findById(req.params.beerId)
            .populate('comments.author')
            .then(beer => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beer);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.end(`POST operation not supported on /beers/${req.params.beerId}`);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Beer.findByIdAndUpdate(req.params.beerId, {
            $set: req.body
        }, { new: true })
            .then(beer => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beer);
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Beer.findByIdAndDelete(req.params.beerId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

beerRouter.route('/:beerId/comments')
    .get((req, res, next) => {
        Beer.findById(req.params.beerId)
            .populate('comments.author')
            .then(beer => {
                if (beer) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(beer.comments);
                } else {
                    err = new Error(`beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Beer.findById(req.params.beerId)
            .then(beer => {
                if (beer) {
                    req.body.author = req.user._id;
                    beer.comments.push(req.body);
                    beer.save()
                        .then(beer => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(beer);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /beers/${req.params.beerId}/comments`);
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Beer.findById(req.params.beerId)
            .then(beer => {
                if (beer) {
                    for (let i = (beer.comments.length - 1); i >= 0; i--) {
                        beer.comments.id(beer.comments[i]._id).remove();
                    }
                    beer.save()
                        .then(beer => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(beer);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

beerRouter.route('/:beerId/comments/:commentId')
    .get((req, res, next) => {
        Beer.findById(req.params.beerId)
            .populate('comments.author')
            .then(beer => {
                if (beer && beer.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(beer.comments.id(req.params.commentId));
                } else if (!beer) {
                    err = new Error(`beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /beers/${req.params.beerId}/comments/${req.params.commentId}`);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Beer.findById(req.params.beerId)
            .then(beer => {
                if (beer && beer.comments.id(req.params.commentId)) {
                    if (req.body.rating) {
                        beer.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.text) {
                        beer.comments.id(req.params.commentId).text = req.body.text;
                    }
                    beer.save()
                        .then(beer => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(beer);
                        })
                        .catch(err => next(err));
                } else if (!beer) {
                    err = new Error(`beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Beer.findById(req.params.beerId)
            .then(beer => {
                if (beer && beer.comments.id(req.params.commentId)) {
                    if (req.user._id.equals(beer.comments.id(req.params.commentId).author._id) || req.user.admin === true) {
                        beer.comments.id(req.params.commentId).remove();
                        beer.save()
                            .then(beer => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(beer);
                            })
                            .catch(err => next(err));
                    } else {
                        err = new Error('You are not authorized to delete this comment.');
                        err.status = 403;
                        return next(err);
                    }
                } else if (!beer) {
                    err = new Error(`Beer ${req.params.beerId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

module.exports = beerRouter;