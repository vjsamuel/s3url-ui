FROM golang:latest
EXPOSE 8080
ENTRYPOINT ["/s3url-ui"]
COPY ./bin/ /
COPY ./webapp /webapp
