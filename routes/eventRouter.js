const express = require('express');
const eventRouter = express.Router();

eventRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send all the events to you');
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /events`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /events');
    })
    .delete((req, res) => {
        res.end('DELETE operation not supported on /events');
    });

eventRouter.route('/:eventId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send details of the event: ${req.params.eventId} to you`)
    })
    .post((req, res) => {
        res.end(`POST operation not supported on /events`);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /events');
    })
    .delete((req, res) => {
        res.end('DELETE operation not supported on /events');
    });
module.exports = eventRouter;