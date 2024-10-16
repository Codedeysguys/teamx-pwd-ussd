const { getDatabase } = require('../config/db');

// Function to add a new emergency contact
async function addContact(phoneNumber, contactNumber) {
    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    try {
        // Find user by phone number
        let user = await contactsCollection.findOne({ phoneNumber });

        // If user does not exist, create a new entry
        if (!user) {
            await contactsCollection.insertOne({
                phoneNumber: phoneNumber,
                emergencyContacts: [contactNumber],
            });
        } else {
            // Check if contact already exists
            if (user.emergencyContacts.includes(contactNumber)) {
                return { message: `Contact ${contactNumber} is already registered.` };
            }

            // Update existing contact with the new contact number
            await contactsCollection.updateOne(
                { phoneNumber: phoneNumber },
                { $push: { emergencyContacts: contactNumber } }
            );
        }
        return { message: `Contact ${contactNumber} saved successfully.` };

    } catch (error) {
        console.error(`Error adding contact: ${error.message}`);
        throw new Error('Failed to add contact');
    }
}

// Function to get all emergency contacts for a user
async function getContacts(phoneNumber) {
    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    try {
        const user = await contactsCollection.findOne({ phoneNumber });
        return user ? user.emergencyContacts : [];
    } catch (error) {
        console.error(`Error retrieving contacts: ${error.message}`);
        throw new Error('Failed to retrieve contacts');
    }
}

// Function to remove a contact
async function removeContact(phoneNumber, contactNumber) {
    const db = await getDatabase();
    const contactsCollection = db.collection('contacts');

    try {
        await contactsCollection.updateOne(
            { phoneNumber },
            { $pull: { emergencyContacts: contactNumber } }
        );
        return { message: `Contact ${contactNumber} removed successfully.` };
    } catch (error) {
        console.error(`Error removing contact: ${error.message}`);
        throw new Error('Failed to remove contact');
    }
}

module.exports = { addContact, getContacts, removeContact };