# Stage 1: Build với Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng với JDK 21
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/target/prepics-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
