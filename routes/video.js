const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController')
const upload = require('../middleware/multer')
const { authPass } = require("../controller/authController");


router.post('/upload',upload.single('file'), videoController.uploadVideo)
router.get('/videoList',authPass,videoController.videoShow)
router.post("/generateTT",videoController.generate);

module.exports = router;
