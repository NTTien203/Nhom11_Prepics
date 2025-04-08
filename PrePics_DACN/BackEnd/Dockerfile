# Stage 1: Build với Maven
FROM maven:3.9.6-eclipse-temurin-23 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Chạy với JDK
FROM amazoncorretto:23
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
