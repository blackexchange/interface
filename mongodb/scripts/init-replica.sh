#!/bin/bash

# Espera o MongoDB iniciar
sleep 10

# Inicia o replica set
mongosh --eval 'rs.initiate({
  _id: "myReplicaSet",
  members: [
    {_id: 0, host: "mongo1:27017"},
    {_id: 1, host: "mongo2:27017"},
    {_id: 2, host: "mongo3:27017"}
  ]
})'
