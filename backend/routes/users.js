import express from 'express';
import { getFreelancers } from '../controllers/userController.js';

const router = express.Router();

// Public route to fetch all freelancers
router.get('/freelancers', getFreelancers);

export default router;
