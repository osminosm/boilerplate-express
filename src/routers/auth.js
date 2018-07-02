import express from 'express';
const router = express.Router();

import {
    getToken
} from '../controllers/auth';

router.route('/token')
    .post(getToken);

export default router;