const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountRouter = require("./account");
const journalRouter = require("./userJournal");
const CommunityRouter = require("./Coummunity");
const blogRouter = require("./blog");
const chatbotRouter = require("./chatbot");

router.use("/user" , userRouter);
router.use("/user/journal", journalRouter);
router.use("/community", CommunityRouter);
router.use("/account" , accountRouter);
router.use("/blogs" , blogRouter);
router.use("/chatbot" , chatbotRouter);


module.exports = router;