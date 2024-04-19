import { Router } from "express";
import { isAuth } from "shared/middleware/is-auth";
import {
  handleCreateBid,
  handleGetBidsForListing,
} from "../controllers/bid.controller";

const router = Router();

router.post("/", isAuth, handleCreateBid);
router.get("/", handleGetBidsForListing);


export default router;
