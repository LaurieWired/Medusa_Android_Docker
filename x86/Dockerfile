FROM python:3

RUN apt-get update && apt-get install -y android-tools-adb

COPY medusa /app/medusa
RUN pip3 install -r /app/medusa/requirements.txt

COPY run_medusa.sh /app/run_medusa.sh
CMD ["sh", "/app/run_medusa.sh"]
