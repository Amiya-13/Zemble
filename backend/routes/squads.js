import express from 'express';
import { createSquad, getMyInvites, acceptInvite } from '../controllers/squadController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All squad routes require authentication
router.use(authMiddleware);

router.post('/', createSquad);
router.get('/invites', getMyInvites);
router.put('/:id/accept', acceptInvite);

export default router;
