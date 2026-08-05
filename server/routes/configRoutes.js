const express = require('express');
const { authorize } = require('../middleware/authMiddleware');
const { getConfigurations, updateConfiguration } = require('../controllers/configController');
const router = express.Router();

router.get('/', authorize(['Operations Admin', 'Hospital Manager']), getConfigurations);
router.put('/', authorize(['Operations Admin', 'Hospital Manager']), updateConfiguration);

module.exports = router;
