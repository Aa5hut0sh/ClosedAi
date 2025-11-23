const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountRouter = require("./account");
const journalRouter = require("./userJournal");
const CommunityRouter = require("./Coummunity")

router.use("/user" , userRouter);
router.use("/user/journal", journalRouter);
router.use("/community", CommunityRouter);
router.use("/account" , accountRouter);

module.exports = router;