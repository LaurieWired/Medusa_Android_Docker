#!/bin/bash

docker build -t medusa .
docker run -it --net=host --name medusa_container medusa
#docker run -it --name medusa_container -e DEVICE_ARCHITECTURE='x64' -e EMULATOR_IP_ADDRESS='192.168.1.1' -e EMULATOR_PORT='5554' medusa
