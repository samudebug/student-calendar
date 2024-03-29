while read -r LINE; do
  if [[ $LINE == *'='* ]] && [[ $LINE != '#'* ]]; then
    ENV_VAR="$(echo $LINE | envsubst)"
    eval "declare $ENV_VAR"
  fi
done < .env
docker-compose  -f ./docker-compose.test.yml run --build --rm test
docker-compose -f ./docker-compose.test.yml stop
docker ps -aq | xargs docker rm
docker image prune -a --force
docker volume prune -a -f
