FROM golang:1.21 AS builder

WORKDIR /app
COPY . .
RUN go build -o main

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .

RUN apk --no-cache add ca-certificates
EXPOSE 8080
CMD ["./main"]