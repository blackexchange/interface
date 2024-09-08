const crypto = require('crypto');
const fs = require('fs');

// Carregar chave privada para assinar a licença
const privateKey = fs.readFileSync('./license/private_key.pem', 'utf8');

// Função para assinar os dados da licença
function signLicense(licenseData) {
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(licenseData));
  sign.end();
  
  // Gerar assinatura com a chave privada
  const signature = sign.sign(privateKey, 'base64');
  return signature;
}

// Função para gerar a licença no formato desejado
function generateLicense(cnpj, licensed_ports, license_id, expires) {
  const licenseData = {
    cnpj: cnpj,
    licensed_ports: licensed_ports,
    license_id: license_id,
    expires: expires
  };

  // Gerar assinatura da licença
  const signature = signLicense(licenseData);

  // Retornar o formato padrão
  return { licenseData, signature };
}

// Exemplo de geração de licença
const license = generateLicense('12345678000123', 3, 'LIC-00123', '2025-12-31');

// Salvar a licença no arquivo JSON
fs.writeFileSync('./license_with_signature.json', JSON.stringify(license, null, 2));

console.log('Licença gerada e salva em license_with_signature.json:', license);
