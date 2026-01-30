import express from 'express';
import {
    submitProposal,
    getProjectProposals,
    acceptProposal,
    rejectProposal,
    getMyProposals
} from '../controllers/proposalController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', submitProposal);
router.get('/my/proposals', getMyProposals);
router.get('/project/:projectId', getProjectProposals);
router.put('/:id/accept', acceptProposal);
router.put('/:id/reject', rejectProposal);

export default router;
