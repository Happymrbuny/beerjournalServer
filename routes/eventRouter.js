const express = require('express');
const Event = require('../models/event');
const authenticate = require('../authenticate');

const eventRouter = express.Router();

eventRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Event.find()
            .then(events => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(events);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Event.create(req.body)
            .then(event => {
                console.log('Event created ', event);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /events');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Event.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

eventRouter.route('/:eventId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Event.findById(req.params.eventId)
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.end(`POST operation not supported on /events/${req.params.eventId}`);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Event.findByIdAndUpdate(req.params.eventId, {
            $set: req.body
        }, { new: true })
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Event.findByIdAndDelete(req.params.eventId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = eventRouter;