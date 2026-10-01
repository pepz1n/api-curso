#!/usr/bin/env bash
set -e
cd ~/api-tarefas
echo ">> Baixando a versão mais recente"
git pull
echo ">> Instalando dependências"
npm install --omit=dev
echo ">> Reiniciando a API"
pm2 restart api
pm2 status
