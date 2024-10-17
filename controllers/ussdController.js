const { addContact, getContacts, removeContact } = require('../models/contact');
// const { sendSosAlert } = require('../utils/alertUtils');

// USSD Controller function
async function handleUssd(req, res) {
    const { sessionId, phoneNumber, text } = req.body;
    let response = '';

    // Split the USSD input text for further handling
    const textArray = text.split('*');

    // Main Menu
    if (text === '') {
        response = `CON Welcome to Emergency Service\n`;
        response += `1. Register Emergency Contact\n`;
        response += `2. View Registered Contacts\n`;
        response += `3. Remove Emergency Contact\n`;
        response += `4. Send SOS Alert\n`;
        response += `5. Call Helpline`;
    }
    
    // 1. Register Emergency Contact
    else if (textArray[0] === '1') {
        if (textArray.length === 1) {
            // Ask for contact number
            response = `CON Enter the emergency contact number:`;
        } else if (textArray.length === 2) {
            const contactNumber = textArray[1];
            const contacts = await getContacts(phoneNumber);
            if (contacts.length >= 3) {
                response = `END You have already registered 3 contacts.`;
            } else {
                // In the controller
                const result = await addContact(phoneNumber, contactNumber);
                response = `END ${result.message}`;
            }
        }
    }
    
    // 2. View Registered Contacts
    else if (textArray[0] === '2') {
        const contacts = await getContacts(phoneNumber);
        if (contacts.length === 0) {
            response = `END You have no registered contacts.`;
        } else {
            response = `END Your registered contacts:\n${contacts.join('\n')}`;
        }
    }
    
    // 3. Remove Emergency Contact
    else if (textArray[0] === '3') {
        const contacts = await getContacts(phoneNumber);
        if (contacts.length === 0) {
            // No contacts available
            response = `END You have no registered contacts.`;
        } else if (textArray.length === 1) {
            // Display contacts for removal
            response = `CON Select a contact to remove:\n`;
            contacts.forEach((contact, index) => {
                response += `${index + 1}. ${contact}\n`;
            });
        } else if (textArray.length === 2) {
            // User selects contact to remove
            const contactIndex = parseInt(textArray[1]) - 1;
            if (contactIndex >= 0 && contactIndex < contacts.length) {
                const contactToRemove = contacts[contactIndex];
                await removeContact(phoneNumber, contactToRemove);
                response = `END Contact ${contactToRemove} removed successfully.`;
            } else {
                response = `END Invalid selection. Please try again.`;
            }
        }
    }

    // 4. Send SOS Alert
    // else if (textArray[0] === '4') {
    //     const contacts = await getContacts(phoneNumber);
    //     if (contacts.length === 0) {
    //         response = `END You have no registered contacts.`;
    //     } else {
    //         await sendSosAlert(phoneNumber, contacts);
    //         response = `END SOS alert sent to your contacts.`;
    //     }
    // }
    
    // 5. Call Helpline
    else if (textArray[0] === '5') {
        response = `END Helplines:\n`;
        response += `Mental Health: 1199\n`;
        response += `Disability Support: 0800 724 333\n`;
        response += `Domestic Violence: 1195`;
    }

    // Send the response back to Africa's Talking
    res.send(response);
}

module.exports = { handleUssd };