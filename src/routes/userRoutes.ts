import express, { Router } from 'express';
import { getAllUsers, getUser } from '../controllers/userController';

const router: Router = express.Router();

router.get('/users/:id', getUser);
router.get('/users', getAllUsers);

export default router;
