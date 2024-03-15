echo "This will stop and remove wallet container, then remove wallet image and create and run new image"

echo "Stoping docker for wallet...."
docker stop  wallet-service

echo "Removing docker for wallet...."
docker rm  wallet-service

echo "Removing docker image for wallet...."
docker image rm  wallet-services-image:latest


echo "Building docker image for wallet...."
docker build -t wallet-services-image:latest .


echo "Running docker image for wallet...."
docker run -d --name wallet-service -v --restart=always -p 8003:8003 -e NODE_ENV=production wallet-services-image:latest
