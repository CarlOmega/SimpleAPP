import * as functions from 'firebase-functions';
import * as express from 'express';
import router from './router';

const app = express();

app.use('/', router);

exports.app = functions.https.onRequest(app);

