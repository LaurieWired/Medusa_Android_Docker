# Medusa Android Docker Container
This is a simple Docker container for automatically running the [Medusa Framework](https://github.com/Ch0pin/medusa). It includes connecting to the device via ADB, pushing Frida to the device, running the Frida server as a daemon on the connected device, and finally running Medusa if all is successful.

## How to Run
Available images on Dockerhub:
- lauriewired/docker-medusa-android-x86
- lauriewired/docker-medusa-android-arm

If the device is running inside a Docker container and you don't mind using host networking (easiest option):

```
docker run -it --net=host --name medusa_container lauriewired/docker-medusa-android-x86
```

If the device is not running inside of a Docker container (assuming the device is running on port 5555):
```
docker run -it -p 5555:5555 --name medusa_container lauriewired/docker-medusa-android-x86
```

If the device is running inside a Docker container and you want to avoid host networking:

Follow this guide to connect the two containers: https://docs.docker.com/network/network-tutorial-standalone/
```
docker run -it -e EMULATOR_IP_ADDRESS='DEVICE_DOCKER_CONTAINER_IP' --name medusa_container lauriewired/docker-medusa-android-x86
```

where 'DEVICE_DOCKER_CONTAINER_IP' is the IP address of the Docker container in which the device is running.

## Optional Configurations
Optional envinronment variables for the container include:
- EMULATOR_IP_ADDRESS: IP address where the device is running.
    - Default: 127.0.0.1
- EMULATOR_PORT: Port number that the device is running on.
    - Default: 5555
- DEVICE_ARCHITECTURE: Instruction set architecture of the device. 
    - x86 container default: "x86"
    - x86 container alternative: "x64"
    - ARM container default: "arm64"
    - ARM container alternative: "arm"
- RUN_FRIDA: Whether to install and run the frida server on the device. Only do this if you already have Frida running on the target device. Otherwise, you will not be able to use most of the Medusa modules.
    - Default: true
    - Alternative: false

Use the "-e" flag to supply environment variables. For example, use the following command to set all of the previously mentioned variables to their alternative values:
```
docker run -it --net=host --name medusa_container -e DEVICE_ARCHITECTURE='x64' -e EMULATOR_IP_ADDRESS='192.168.1.2' -e EMULATOR_PORT='5554' -e RUN_FRIDA='false' lauriewired/docker-medusa-android-x86
```