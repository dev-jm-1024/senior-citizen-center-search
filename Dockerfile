FROM eclipse-temurin:17-jre-alpine
LABEL authors="JM"

WORKDIR /app

# JAR 파일 복사
COPY build/libs/*-SNAPSHOT.jar app.jar

# Cloud Run의 PORT 환경변수 사용, 기본값 8080
EXPOSE ${PORT:-8080}

# Cloud Run에서 제공하는 PORT 환경변수를 Spring Boot의 server.port로 전달
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]