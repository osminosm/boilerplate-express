import express from 'express';
import autoguard from '../middlewares/autoguard';
const router = express.Router();

import {
    addUser,
    listUsers,
    editUser,
    deleteUser
} from '../controllers/users';

router.route('/')
    .get(autoguard(), listUsers)
    .post(autoguard(), addUser)
    .delete(autoguard(), deleteUser);

router.route('/:username')
    .put(autoguard(), editUser);

export default router;