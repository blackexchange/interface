

 function generateSampleNumber(text) {
    // Parte inicial: data no formato YYMMDD para garantir unicidade temporal
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    
    // Parte intermediária: um identificador único (UUID parcial)
    const uniquePart = Math.random().toString(36).slice(2, 6).toUpperCase();
    
    // Parte final: identificador do paciente truncado para 4 caracteres
    const patientPart = text.slice(5, 2).toUpperCase() + text.slice(30, 2).toUpperCase();

    // Combina as partes para gerar o número de amostra em base-36 (alfanumérico)
    const base36Sample = `${datePart}${patientPart}${uniquePart}`;

    // Converter o número de amostra em base-36 para um número decimal
    const decimalValue = parseInt(base36Sample, 36);

    // Converter o número decimal para base-32 (octodecimal)
    const base32Sample = decimalValue.toString(32).toUpperCase();

    // Verifica o comprimento e ajusta se necessário (opcional)
    if (base32Sample.length > 10) { // Tamanho ajustável
        return base32Sample.slice(0, 10);
    }
    
    return base32Sample;
}

module.exports = {
    generateSampleNumber
}