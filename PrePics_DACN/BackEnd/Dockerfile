FROM amazoncorretto:23
WORKDIR /app
COPY target/*.jar  prepics-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]