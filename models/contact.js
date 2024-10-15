const { getDatabase } = require('../config/db');

// Function to add a new emergency contact
async function addContact(phoneNumber, contactNumber) {
    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    let user = await contactsCollection.findOne({ phoneNumber });

    if (!user) {
        // Create new contact
        await contactsCollection.insertOne({
            phoneNumber: phoneNumber,
            emergencyContacts: [contactNumber],
        });
    } else {
        // Update existing contact
        await contactsCollection.updateOne(
            { phoneNumber: phoneNumber },
            { $push: { emergencyContacts: contactNumber } }
        );
    }
}

// Function to get all emergency contacts for a user
async function getContacts(phoneNumber) {
    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');
    const user = await contactsCollection.findOne({ phoneNumber });
    return user ? user.emergencyContacts : [];
}

module.exports = { addContact, getContacts };