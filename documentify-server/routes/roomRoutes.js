import express from 'express';
import { createRoom, getRoom, updateRoom } from '../controllers/roomController.js';

const router = express.Router();

router.post('/', createRoom);       
router.get('/:roomId', getRoom);     
router.patch('/:roomId', updateRoom); 

export default router;
