import { Router } from 'express';

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import requireRole from "../middlewares/requireRole.js";
const router  = Router();


router.route("/updatestock").put(verifyJWT,requireRole("admin"),updatestock);




export default router;