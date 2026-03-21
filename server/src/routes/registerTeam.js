import express from 'express';
import { registerData } from '../controllers/register.js';

const router = express.Router();

// The path is relative to how it's mounted in server.js
// so this matches POST /registerTeam/
router.post('/', registerData);

export default router;
