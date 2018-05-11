FROM golang:latest
EXPOSE 8080
CHDIR /
ENTRYPOINT ["/s3url-ui"]
COPY ./bin/ /
COPY ./webapp /webapp
