const express = require('express');
const breweryRouter = express.Router();

breweryRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send all the breweries to you');
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /breweries`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /breweries');
    })
    .delete((req, res) => {
        res.end('DELETE operation not supported on /breweries');
    });

breweryRouter.route('/:breweryId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send details of the brewery: ${req.params.breweryId} to you`)
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /breweries`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /breweries');
    })
    .delete((req, res) => {
        res.end('DELETE operation not supported on /breweries');
    });
module.exports = breweryRouter;