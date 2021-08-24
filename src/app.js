"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = (db) => {
  const service = require('./app.service')(db);
  app.get("/health", (req, res) => res.send("Healthy"));
  app.post("/rides", jsonParser, service.createRider);
  app.get("/rides", service.getRiders);
  app.get("/rides/:id", service.getRiderById);
  return app;
};
