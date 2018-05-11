FROM golang:latest
EXPOSE 8080
WORKDIR /
ENTRYPOINT ["/s3url-ui"]
COPY ./bin/ /
COPY ./webapp /webapp
