#!/bin/bash
set -e

# Espera que o RabbitMQ inicie
echo "Aguardando o RabbitMQ iniciar..."


# Habilita o plugin de gerenciamento, se necessário
rabbitmq-plugins enable rabbitmq_management

echo "Iniciando servico..."
rabbitmq-server

sleep 10

MAX_TRIES=30
COUNT=0
while ! rabbitmqctl wait /var/lib/rabbitmq/mnesia/rabbit\@$HOSTNAME.pid; do
  sleep 1
  COUNT=$((COUNT+1))
  if [ "$COUNT" -ge "$MAX_TRIES" ]; then
    echo "Falha ao esperar pelo RabbitMQ iniciar."
    exit 1
  fi
done

echo "Configurando hosts..."
# Configura o vhost
rabbitmqctl add_vhost lab_vhost


echo "Adicionando usuarios..."

# Cria usuários e define suas permissões
rabbitmqctl delete_user admin || true 
rabbitmqctl delete_user publisher || true 
rabbitmqctl delete_user viewer || true 

rabbitmqctl add_user admin 12345
rabbitmqctl add_user viewer 12345
rabbitmqctl add_user publisher 12345


rabbitmqctl set_user_tags admin administrator


echo "Configurando permissoes..."

rabbitmqctl set_permissions -p lab_vhost admin ".*" ".*" ".*"
rabbitmqctl set_permissions -p lab_vhost publisher "" ".*" ""
rabbitmqctl set_permissions -p lab_vhost viewer "" "" ".*"



echo "Configurando filas..."
# Declara as filas
rabbitmqadmin -u admin -p 12345 declare queue --vhost=lab_vhost name=results durable=true
rabbitmqadmin -u admin -p 12345 declare queue --vhost=lab_vhost name=orders durable=true
rabbitmqadmin -u admin -p 12345 declare queue --vhost=lab_vhost name=sample_seen durable=true
rabbitmqadmin -u admin -p 12345 declare queue --vhost=lab_vhost name=distribution durable=true

echo "Filas configuradas."
