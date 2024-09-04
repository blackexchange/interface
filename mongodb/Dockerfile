# Usando a imagem oficial do MongoDB
FROM mongo:latest

# Definir variáveis de ambiente para o ReplicaSet
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=admin123
ENV MONGO_INITDB_DATABASE=mydatabase

# Expor a porta padrão do MongoDB
EXPOSE 27017

# Copiar script de inicialização
COPY ./scripts/init-replica.sh /docker-entrypoint-initdb.d/


# Comando para iniciar o MongoDB com a replicação ativada
CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]
