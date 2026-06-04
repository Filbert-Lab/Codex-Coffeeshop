const express = require("express");
const { renderApp } = require("../controllers/ssrCtrl");

const router = express.Router();

router.get("*", renderApp);

module.exports = router;
