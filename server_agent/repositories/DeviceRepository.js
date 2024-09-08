class DeviceRepository {
    constructor(databaseConnection) {
        this.db = databaseConnection;
    }

    // Método para buscar dispositivos do banco de dados
    async getDevices() {
        const devices = await this.db.query("SELECT * FROM dispositivos");
        return devices.rows; // Supondo que seja um retorno de um banco relacional
    }
}
