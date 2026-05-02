// src/core/hydrator.js
const fs = require('fs');
const path = require('path');

/**
 * Reads the actual JSON files provided in the magicpin dataset.
 */
const getCategoryRules = (categoryName) => {
    try {
        // Find the path to the specific category file (e.g., dataset/categories/salons.json)
        const filePath = path.join(__dirname, '../../dataset/categories', `${categoryName.toLowerCase()}.json`);
        
        // Read and parse the file
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const categoryData = JSON.parse(rawData);

        // We return the raw rules as a formatted string so the AI can read it easily
        return JSON.stringify(categoryData, null, 2);
        
    } catch (error) {
        console.error(`⚠️ Warning: Could not find rules for category '${categoryName}'. Falling back to default.`);
        return "No specific category rules found. Follow standard business growth practices.";
    }
};

/**
 * The Hydrator builds the exact context string the AI needs by combining 
 * the 4 raw input layers.
 */
const buildMessageContext = (category, merchant, trigger, customer) => {
    
    console.log(`💧 Hydrating context for category: ${category}`);

    // Read the real rules from the dataset folder
    const categoryRules = getCategoryRules(category);

    // Format the Merchant context
    const merchantContext = `
Merchant Name: ${merchant.name || 'Unknown Business'}
Live Offers Available: ${JSON.stringify(merchant.offers || 'None')}
    `.trim();

    // Format the Trigger context (Why are we messaging them NOW?)
    const triggerContext = `
Trigger Event: ${trigger.type || 'Standard Check-in'}
Details: ${trigger.details || 'N/A'}
    `.trim();

    // Assemble the final Master Context String for the AI
    const masterContext = `
YOU MUST FOLLOW THESE CATEGORY RULES:
${categoryRules}

MERCHANT DATA:
${merchantContext}

WHY WE ARE MESSAGING THEM TODAY:
${triggerContext}

${customer ? `CUSTOMER CONTEXT:\n${JSON.stringify(customer)}` : ''}
    `.trim();

    return masterContext;
};

module.exports = { buildMessageContext };