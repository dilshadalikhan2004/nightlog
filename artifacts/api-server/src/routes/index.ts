import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import memoriesRouter from "./memories";
import invitesRouter from "./invites";
import messagesRouter from "./messages";
import usersRouter from "./users";
import feedRouter from "./feed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(memoriesRouter);
router.use(invitesRouter);
router.use(messagesRouter);
router.use(usersRouter);
router.use(feedRouter);

export default router;
