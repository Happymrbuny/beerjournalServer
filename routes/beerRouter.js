const express = require('express');
const beerRouter = express.Router();

beerRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send all the beers to you');
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

beerRouter.route('/:beerId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send details of the beer: ${req.params.beerId} to you`)
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