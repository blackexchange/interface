FROM ubuntu:18.04

# Instalar dependências
RUN apt-get update && apt-get install -y \
    odbcinst1debian2 \
    unixodbc \
    unixodbc-dev \
    libsapdbodbc

# Copiar configuração do ODBC para o MaxDB
COPY odbc.ini /etc/odbc.ini
COPY odbcinst.ini /etc/odbcinst.ini

# Definir o MaxDB como a DSN padrão
ENV ODBCINI=/etc/odbc.ini

# Expor a porta do MaxDB
EXPOSE 7210

CMD ["odbcinst", "-j"]
