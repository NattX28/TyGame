FROM golang:1.23.4 AS builder

WORKDIR /app
COPY . .
# Build แบบ static binary ด้วย CGO_ENABLED=0
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 5004
CMD ["./main"]