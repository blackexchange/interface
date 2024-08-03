// globalState.js
let data = {};  // Armazena o estado global aqui

module.exports = {
    setData(newData) {
        data = {...data, ...newData};
    },
    getData() {
        return data;
    }
};