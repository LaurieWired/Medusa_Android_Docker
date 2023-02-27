#!/bin/bash

# Check if user has set specific IP and port
# Otherwise default to 127.0.0.1:5555
if [ -z ${EMULATOR_IP_ADDRESS+x} ]
then
  echo "Using default IP 127.0.0.1"
  EMULATOR_IP_ADDRESS="127.0.0.1"
else
  echo "Using emulator IP '$EMULATOR_IP_ADDRESS'"
fi

if [ -z ${EMULATOR_PORT+x} ]
then
  echo "Using default port 5555"
  EMULATOR_PORT="5555"
else
  echo "Using emulator port '$EMULATOR_PORT'"
fi

# Connect to emulator
adb root
adb_out=`adb devices | awk 'NR>1 {print$q}'`
if test -n "$adb_out"
then
  adb devices
else
  adb connect $EMULATOR_IP_ADDRESS:$EMULATOR_PORT
fi

# Exit container if connection was unsuccessful
adb_out=`adb devices | awk 'NR>1 {print$q}'`
if ! test -n "$adb_out"
then
  echo "Failed to connect to emulator. Exiting..."
  exit
fi

# Run frida if env var is not set to false
if [ "$RUN_FRIDA" = "false" ]
then
  echo "Skipping frida"
else
  echo "Running frida"

  if [ "$DEVICE_ARCHITECTURE" = "x64" ]
  then
    echo "Using device architecture x64"
  else
    echo "Using device architecture x86"
    DEVICE_ARCHITECTURE="x86"
  fi

  chmod +x /app/medusa/frida/frida-server-$DEVICE_ARCHITECTURE
  adb push /app/medusa/frida/frida-server-$DEVICE_ARCHITECTURE /data/local/tmp
  adb shell "/data/local/tmp/frida-server-$DEVICE_ARCHITECTURE -D &"
fi

python3 /app/medusa/medusa.py
