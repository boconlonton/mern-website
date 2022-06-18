import http from 'http';
import express from 'express';
import logging from '../config/logging';
import config from '../config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';

import userRoutes from './routes/user';
import blogRoutes from './routes/blog';

const router = express();

// Server Handling
const httpServer = http.createServer(router);

// Connect to Firebase Admin
let serviceAccountKey = require('../config/serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountKey)
});

// Connect to Mongo
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logging.info('Mongo connected.');
    })
    .catch((error) => {
        logging.error(error);
    });

// Logging Middleware
router.use((req, res, next) => {
    logging.info(`METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress}`);
    req.on('finish', () => {
        logging.info(`METHOD: ${req.method} - URL: ${req.url} - IP: ${req.socket.remoteAddress} - STATUS: ${req.statusCode}`);
    });

    next();
});

// Parse the Body
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// API Access Policies
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

// Error Handling
router.use((req, res, next) => {
    const error = new Error('Not found');

    return res.status(404).json({
        message: error.message
    });
});

// Listen for Requests
httpServer.listen(config.server.port, () => {
    logging.info(`Server is running at ${config.server.host}:${config.server.port} ...`);
});
