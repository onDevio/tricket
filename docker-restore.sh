#!/bin/bash
echo "Este comando restaurará la última copia de la BBDD de MongoDb que se encuentre en S3"
echo "--IMPORTANTE--"
echo "Los datos actuales de la BBDD de MongoDb se perderán."
read -p "Desea continuar? [s/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "Restaurando BDD MondoDb desde S3"
  docker-compose run backup /backup/restore.sh
else
  echo "Abortando restauración BDD MondoDb desde S3"
fi
