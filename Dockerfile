FROM node:10-alpine as build-step

RUN mkdir /app

WORKDIR /app

COPY ./app-ui/package.json /app

RUN npm install

COPY ./app-ui /app

RUN npm run build


FROM python:3.6.7

WORKDIR /app
COPY --from=build-step /app/build ./static
ADD ./app /app

RUN pip install -U pip

RUN pip install tensorflow==2.5.0
RUN pip install -r requirements.txt
RUN apt-get update 
RUN apt-get install ffmpeg libsm6 libxext6  -y

EXPOSE 5000

CMD ["python","application.py"]