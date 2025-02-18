# Use official Golang image as builder
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o api-gateway

# Use Alpine as final image
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/api-gateway .
CMD ["./api-gateway"]
