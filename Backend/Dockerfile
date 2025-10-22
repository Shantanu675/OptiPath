FROM openjdk:22-jdk
WORKDIR /app
ADD pathOptimizer/target/pathOptimizer-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080
