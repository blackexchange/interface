const CONTROL_CODES = {
    SB: 0x0B,  // Start Block (Início do bloco de mensagem)
    EB: 0x1C,  // End Block (Fim do bloco de mensagem)
    CR: 0x0D,  // Carriage Return (Fim de linha/segmento)
    LF: 0x0A,  // Line Feed (Alimentação de linha)
    FS: 0x1C,  // File Separator (Separador de arquivo, utilizado como delimitador de mensagem HL7)
    GS: 0x1D,  // Group Separator (Separador de grupo)
    RS: 0x1E,  // Record Separator (Separador de registros)
    US: 0x1F,  // Unit Separator (Separador de unidade)
    STX: 0x02, // Start of Text (Início de texto)
    ETX: 0x03, // End of Text (Fim de texto)
    ETB: 0x17, // End of Block (Fim de bloco)
    ENQ: 0x05, // Enquiry (Consulta)
    ACK: 0x06, // Acknowledge (Confirmação de recebimento)
    NAK: 0x15, // Negative Acknowledge (Confirmação negativa)
    EOT: 0x04  // End of Transmission (Fim de transmissão)
};

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

function getControl(codeName) {
    return codeValue =String.fromCharCode(CONTROL_CODES[codeName]);
 
}

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[-:T]/g, '').split('.')[0]; // Formata a data no estilo HL7
}






module.exports = { parseHL7MessageToJSON, serializeHL7MessageFromJSON, getCurrentTimestamp,getControl};


