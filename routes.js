const express = require('express');
const router = express.Router();
const controller = require('./controller'); 

// --- THE JUDGE'S REQUIRED ENDPOINTS ---

// 1. Generate Messages (The judge calls this "tick")
router.post('/tick', controller.generateMessage);

// 2. Conversation handling
router.post('/reply', controller.generateMessage);

// 3. Context Push (Accepts their data)
router.post('/context', (req, res) => {
    res.status(200).json({ success: true });
});

// 4. Metadata (Tells the judge who you are)
router.get('/metadata', (req, res) => {
    res.status(200).json({ 
        team: "Vera AI Engine", 
        model: "Gemini 2.5 Flash" 
    });
});

// (Keeping your original /generate just in case!)
router.post('/generate', controller.generateMessage);

module.exports = router; 