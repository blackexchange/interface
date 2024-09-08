class BaseProtocol {
    constructor(device) {
        if (new.target === BaseProtocol) {
            throw new Error("Cannot instantiate abstract class DeviceCommunication directly.");
        }
        this.device = device;
    }

    // Método comum para envio de mensagem
    sendMessage(message) {
        throw new Error("sendMessage() must be implemented by subclass");
    }

    // Método comum para receber mensagem
    receiveMessage(message) {
        throw new Error("receiveMessage() must be implemented by subclass");
    }

    // Método comum para processar a mensagem (envio + recebimento)
    processMessage(message) {
        console.log(`Processando mensagem para o dispositivo ${this.device.id}`);
        this.sendMessage(message);
        return this.receiveMessage(message);
    }
}
