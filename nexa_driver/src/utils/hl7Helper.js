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

        // Mapeia os campos diretamente, sem tratar subcampos separados por ^
        const segmentData = fields.reduce((acc, field, index) => {
            acc[`field${index}`] = field; // Atribui cada campo diretamente ao JSON
            return acc;
        }, {});

        parsedMessage[segmentType].push(segmentData);
    });

    return parsedMessage;
}

function serializeHL7MessageFromJSON(parsedMessage) {
    // Itera sobre cada segmento do parsedMessage
    const segments = parsedMessage.map(segmentObject => {
        return Object.keys(segmentObject).map(segmentType => {
            const segment = segmentObject[segmentType];

            // Concatena os campos do segmento, separados por '|'
            return Object.keys(segment).map(fieldKey => {
                const fieldValue = segment[fieldKey];

                // Verifica se o campo contém subcampos (objeto) e converte corretamente
                if (typeof fieldValue === 'object' && fieldValue !== null) {
                    return Object.values(fieldValue).join('^'); // Se o campo tiver subcampos, os une com '^'
                } else {
                    return fieldValue || ''; // Retorna o valor do campo ou uma string vazia
                }
            }).join('|'); // Une os campos com '|'
        }).join('\r'); // Une os segmentos com '\r'
    });

    // Concatena todos os segmentos com '\r'
    const message = segments.join('\r');
    return message;
}







module.exports = { parseHL7MessageToJSON, serializeHL7MessageFromJSON ,parseHL7Message, serializeHL7Message};


