function parseHL7Message(rawMessage) {
    const segments = rawMessage.split('\r').filter(segment => segment !== '');
    return segments.map(segment => segment.split('|'));
}

function serializeHL7Message(parsedMessage) {
    return parsedMessage.map(segment => segment.join('|')).join('\r') + '\r';
}

function parseHL7MessageToJSON(rawMessage) {
    
    const segments = rawMessage.split('\r').filter(segment => segment !== '');

    const parsedMessage = {};
    segments.forEach(segment => {
        const fields = segment.split('|');
        const segmentType = fields[0];

        if (!parsedMessage[segmentType]) {
            parsedMessage[segmentType] = [];
        }

        const segmentData = fields.reduce((acc, field, index) => {
            acc[`field${index}`] = field;
            return acc;
        }, {});

        parsedMessage[segmentType].push(segmentData);
    });

    return parsedMessage;
}

function serializeHL7MessageFromJSON(parsedMessage) {
    const segments = Object.keys(parsedMessage).map(segmentType => {
        return parsedMessage[segmentType].map(segment => {
            return Object.values(segment).join('|');
        }).join('\r');
    });

    return segments.join('\r') + '\r';
}

module.exports = { parseHL7MessageToJSON, serializeHL7MessageFromJSON ,parseHL7Message, serializeHL7Message};


