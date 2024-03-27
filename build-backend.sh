while read -r LINE; do
  if [[ $LINE == *'='* ]] && [[ $LINE != '#'* ]]; then
    ENV_VAR="$(echo $LINE | envsubst)"
    eval "declare $ENV_VAR"
  fi
done < .env
docker build . -t student-calendar \
--build-arg FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT \
 --build-arg DATABASE_URL=$DATABASE_URL \
 --build-arg BASE_URL=$BASE_URL \
 --build-arg GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT \
 --build-arg CLOUD_TASKS_QUEUE=$CLOUD_TASKS_QUEUE \
 --build-arg GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION \
 --build-arg API_KEY=$API_KEY
