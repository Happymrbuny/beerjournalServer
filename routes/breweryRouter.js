const express = require('express');
const Brewery = require('../models/brewery');

const breweryRouter = express.Router();

breweryRouter.route('/')
    .get((req, res, next) => {
        Brewery.find()
            .then(brewery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Brewery.create(req.body)
            .then(brewery => {
                console.log('Brewery created ', brewery);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /breweries');
    })
    .delete((req, res, next) => {
        Brewery.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

breweryRouter.route('/:breweryId')
    .get((req, res, next) => {
        Brewery.findById(req.params.breweryId)
            .then(brewery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /breweries/${req.params.breweryId}`);
    })
    .put((req, res) => {
        Brewery.findByIdAndUpdate(req.params.breweryId, {
            $set: req.body
        }, { new: true })
            .then(brewery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Brewery.findByIdAndDelete(req.params.breweryId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = breweryRouter;