const express = require('express');
const Beer = require('../models/beer');

const beerRouter = express.Router();

beerRouter.route('/')
    .get((req, res, next) => {
        Beer.find()
            .then(beers => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beers);
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Beer.create(req.body)
            .then(beer => {
                console.log('Beer created ', beer);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beer);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /beers');
    })
    .delete((req, res, next) => {
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
            .then(beer => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(beer);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /beers/${req.params.beerId}`);
    })
    .put((req, res) => {
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
    .delete((req, res, next) => {
        Beer.findByIdAndDelete(req.params.beerId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

beerRouter.route('/:beerId/comments')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send comments of the beer: ${req.params.beerId} to you`)
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /beers`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /beers');
    })
    .delete((req, res) => {
        res.end('DELETE operation not supported on /beers');
    });

beerRouter.route('/:beerId/comments/:commenId');

module.exports = beerRouter;