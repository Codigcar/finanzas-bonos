import {Router} from 'express';
import { createBono, getBonosByUserId, updateBonoByUserId } from '../controllers/bono.controller';
const router = Router();

router.post('/', createBono);
router.get('/:id', getBonosByUserId);
router.patch('/:id', updateBonoByUserId);

export default router;