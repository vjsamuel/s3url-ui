FROM scratch
EXPOSE 8080
ENTRYPOINT ["/s3url-ui"]
COPY ./bin/ /