# Description
Easily run the **[Medusa Framework](https://github.com/Ch0pin/medusa)** in a **Docker** container with Android Device support. 

This container automates the process of connecting to the device via **ADB**, deploying **Frida** to the device, running the Frida server as a daemon on the connected device, and finally executing **Medusa** if everything is successful.

## How to Run
Choose an image from Dockerhub:
- [lauriewired/docker-medusa-android-x86](https://hub.docker.com/r/lauriewired/docker-medusa-android-x86)
- [lauriewired/docker-medusa-android-arm](https://hub.docker.com/r/lauriewired/docker-medusa-android-arm)

### Option 1: Host Networking (Easiest)

If the device is running inside a Docker container and host networking is acceptable:

```
docker run -it --net=host --name medusa_container lauriewired/docker-medusa-android-x86
```

### Option 2: Device Outside of Docker Container

If the device is not running inside of a Docker container (assuming the device is running on port 5555):
```
docker run -it -p 5555:5555 --name medusa_container lauriewired/docker-medusa-android-x86
```

### Option 3: Device in Docker Container (Without Host Networking)
If the device is running inside a Docker container and you want to avoid host networking:

Follow this guide to connect the two containers: https://docs.docker.com/network/network-tutorial-standalone/
```
docker run -it -e EMULATOR_IP_ADDRESS='DEVICE_DOCKER_CONTAINER_IP' --name medusa_container lauriewired/docker-medusa-android-x86
```

where 'DEVICE_DOCKER_CONTAINER_IP' is the IP address of the Docker container in which the device is running.

## Optional Configurations

Customize the container using the following environment variables:

- EMULATOR_IP_ADDRESS: IP address where the device is running.
    - Default: 127.0.0.1
- EMULATOR_PORT: Port number that the device is running on.
    - Default: 5555
- DEVICE_ARCHITECTURE: Instruction set architecture of the device. 
    - x86 container default: "x86"
    - x86 container alternative: "x64"
    - ARM container default: "arm64"
    - ARM container alternative: "arm"
- RUN_FRIDA: Install and run the Frida server on the device. Only set to 'false' if Frida is already running on the target device, otherwise most Medusa modules will not work.
    - Default: true
    - Alternative: false

Use the "-e" flag to supply environment variables. For example, use the following command to set all of the previously mentioned variables to their alternative values:
```
docker run -it --net=host --name medusa_container -e DEVICE_ARCHITECTURE='x64' -e EMULATOR_IP_ADDRESS='192.168.1.2' -e EMULATOR_PORT='5554' -e RUN_FRIDA='false' lauriewired/docker-medusa-android-x86
```
