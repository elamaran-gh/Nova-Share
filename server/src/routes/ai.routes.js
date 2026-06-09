import {Router} from "express";
import authenticate from "../middlewares/auth.middlewares.js";
import { aiSearch, aiSummarize } from "../controllers/ai.controller.js";

const router = Router();

router.post("/search", authenticate, aiSearch);
router.post("/summarize", authenticate, aiSummarize);

export default router;
