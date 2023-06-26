const express = require('express');
const Brewery = require('../models/brewery');
const authenticate = require('../authenticate');
const cors = require('./cors');

const breweryRouter = express.Router();

breweryRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Brewery.find()
            .then(brewery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Brewery.create(req.body)
            .then(brewery => {
                console.log('Brewery created ', brewery);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /breweries');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Brewery.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

breweryRouter.route('/:breweryId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Brewery.findById(req.params.breweryId)
            .then(brewery => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(brewery);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.end(`POST operation not supported on /breweries/${req.params.breweryId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
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
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Brewery.findByIdAndDelete(req.params.breweryId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = breweryRouter;