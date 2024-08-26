# Usar a imagem oficial do MongoDB como base
FROM mongo:latest

# Criar um diretório para armazenar os dados do MongoDB
RUN mkdir -p /data/db

# Expor a porta padrão do MongoDB
EXPOSE 27017

# Comando para iniciar o MongoDB
CMD ["mongod"]
