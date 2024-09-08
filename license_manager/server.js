const crypto = require('crypto');
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');

// Carregar chave pública para verificar a assinatura
const publicKey = fs.readFileSync('./license/public_key.pem', 'utf8');

// Função para verificar a assinatura da licença
function verifyLicenseSignature(licenseData, signature) {
  const verify = crypto.createVerify('SHA256');
  
  // Certifique-se de que os dados estão na mesma ordem e formato
  verify.update(JSON.stringify(licenseData));
  verify.end();

  return verify.verify(publicKey, signature, 'base64');
}

// Licenças armazenadas no servidor (pode ser um banco de dados)
const licenses = [
  {
    cnpj: '12345678000123',
    licensed_ports: 3,
    license_id: 'LIC-00123',
    expires: '2025-12-31',
    active_ports: 0  // Portas atualmente em uso
  }
];

// Rota para validar licença
app.post('/validate-license', (req, res) => {
  const { licenseData, signature, requestPorts } = req.body;

  // Encontre a licença no servidor
  const license = licenses.find(lic => lic.license_id === licenseData.license_id);
  
  if (!license) {
    return res.status(400).json({ valid: false, message: 'Licença não encontrada.' });
  }

  // Verificar se a licença expirou
  const currentDate = new Date().toISOString().split('T')[0];
  if (license.expires < currentDate) {
    return res.status(400).json({ valid: false, message: 'Licença expirada.' });
  }

  // Verificar se o CNPJ está correto
  if (license.cnpj !== licenseData.cnpj) {
    return res.status(400).json({ valid: false, message: 'CNPJ inválido.' });
  }

  // Verificar se o número de portas solicitado excede o número de licenças permitidas
  if (license.active_ports + requestPorts > license.licensed_ports) {
    return res.status(400).json({ valid: false, message: 'Limite de portas excedido.' });
  }

  // Verificar a assinatura da licença
  if (!verifyLicenseSignature(licenseData, signature)) {
    console.error('Assinatura inválida para a licença:', licenseData);
    return res.status(400).json({ valid: false, message: 'Assinatura de licença inválida.' });
  }

  // Atualizar o número de portas ativas
  license.active_ports += requestPorts;

  return res.json({ valid: true, message: 'Licença válida.' });
});

// Iniciar o servidor de validação
app.listen(3000, () => {
  console.log('Servidor de licenças rodando na porta 3000');
});
