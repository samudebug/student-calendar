get-content .env | foreach {
    $name, $value = $_.split('=')
    set-content env:\$name $value
}

docker build . -t student-calendar --build-arg FIREBASE_SERVICE_ACCOUNT=$Env:FIREBASE_SERVICE_ACCOUNT --build-arg DATABASE_URL=$Env:DATABASE_URL
