echo "This will stop and remove wallet container, then remove wallet image and create and run new image"

echo "Stoping docker for wallet...."
docker stop  wallet-service-v2

echo "Removing docker for wallet...."
docker rm  wallet-service-v2

echo "Removing docker image for wallet...."
docker image rm  wallet-services-v2-image:latest


echo "Building docker image for wallet...."
docker build -t wallet-services-v2-image:latest .


echo "Running docker image for wallet...."
docker run -d --name wallet-service-v2 -v --restart=always -p 8004:8003 -e NODE_ENV=production wallet-services-v2-image:latest
