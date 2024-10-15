const express = require('express');
const { addContact, getContacts } = require('../models/contact');
const router = express.Router();

router.post('/ussd', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    // USSD Logic
    if (text === '') {
        response = `CON Welcome to the Emergency Service\n1. Register Emergency Contact\n2. Send SOS\n3. Call Helpline`;
    } else if (text.startsWith('1')) {
        // Register Emergency Contact
        if (text.split('*').length === 1) {
            response = `CON Enter the emergency contact number:`;
        } else {
            const contactNumber = text.split('*')[1];
            await addContact(phoneNumber, contactNumber);
            response = `END Emergency contact ${contactNumber} saved successfully.`;
        }
    } else if (text.startsWith('2')) {
        // SOS Alert Logic (To be implemented)
        response = `END SOS alert sent successfully.`;
    } else if (text.startsWith('3')) {
        // Helpline Logic (To be implemented)
        response = `END Connecting to Helpline...`;
    }

    res.send(response);
});

module.exports = router;