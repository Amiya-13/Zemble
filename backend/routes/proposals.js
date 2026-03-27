import express from 'express';
import { submitProposal, submitSquadProposal, getProjectProposals, acceptProposal, rejectProposal, getMyProposals } from '../controllers/proposalController.js';
import express from 'express';
import { submitProposal, submitSquadProposal, getProjectProposals, acceptProposal, rejectProposal, getMyProposals } from '../controllers/proposalController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', submitProposal);
router.get('/my/proposals', getMyProposals);
router.post('/squad', submitSquadProposal);
router.get('/project/:projectId', getProjectProposals);
router.put('/:id/accept', acceptProposal);
router.put('/:id/reject', rejectProposal);

export default router;
