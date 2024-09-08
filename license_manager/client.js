const axios = require('axios');

async function validateLicense(licenseData, signature, requestPorts) {
  try {
    const response = await axios.post('http://localhost:3000/validate-license', {
      licenseData: licenseData,
      signature: signature,
      requestPorts: requestPorts
    });
    
    if (response.data.valid) {
      console.log('Licença válida. Abertura permitida.');
      return true;
    } else {
      console.error('Licença inválida:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Erro ao validar licença:', error.message);
    return false;
  }
}

const licenseData = {
  cnpj: '12345678000123',
  licensed_ports: 3,
  license_id: 'LIC-00123',
  expires: '2025-12-31'
};

const signature = "fBR2/d8BgEacZtr7cUPTj1Sr5+l7jDAwrjk6GREgsUdC3aif8H03c9ingriLuDvwnugjqQjyswK0K8oGV4doE+h+zLwlBdoLqD3O0REaXMtAp2d90J7vooxZfYlGDzDZ8EgjZQVClTISBhwa1lkrAbBFOboXRZNJ2I7Yw1OBTFxwVaTgb6Z7Wx6DIM40/Auam65o3u2VuY7dqIwXfn/DXrgySJ2SBPKTblpVkl8uK2pZWhXu0jT4DGjFIZZWZJa2mCMJFlPMHUSC+bOQLSDkQlwqh7o05ZW/9GjQ0LBhf9jp7lC53bBtOfDqngRxyc8koPTvgKz+0QEg/xWZmusHzA==";
// Exemplo de chamada para validar a licença
validateLicense(licenseData, signature, 3);
