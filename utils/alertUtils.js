const africastalking = require('africastalking')({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
});
const sms = africastalking.SMS;
// const { getLocation } = require('./locationUtils'); // Assuming you have a getLocation function

function formatPhoneNumber(phoneNumber) {
    // Assuming phone numbers are Kenyan and start with "07", "01" etc.
    // Add the country code +254 if it's not already included
    if (phoneNumber.startsWith('0')) {
        return `+254${phoneNumber.substring(1)}`; // Replaces leading "0" with "+254"
    }
    return phoneNumber; // If already in international format
}

// Function to send SOS alert SMS to saved contacts
async function sendSosAlert(phoneNumber, contacts) {
    try {
        // Fetch user location (if available)
        // const location = await getLocation(phoneNumber);
        // const locationInfo = location ? `Location: ${location}` : 'Location unavailable';

        // Create SOS message
        const message = `SOS Alert from ${phoneNumber}.`;

        // Send SMS to each contact
        const recipients = contacts.map(contact => formatPhoneNumber(contact)); // List of contacts
        console.log('Sending SOS Alert to:', recipients);

        const options = {
            to: recipients,
            message: message,
            from: ''
        };

        const result = await sms.send(options);
        console.log('SOS Alert sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending SOS Alert:', error);
        throw new Error('Failed to send SOS Alert');
    }
}

module.exports = { sendSosAlert };
