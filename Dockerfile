FROM eclipse-temurin:17-jre-alpine
LABEL authors="JM"

WORKDIR /app

# JAR 파일 복사
COPY build/libs/*-SNAPSHOT.jar app.jar

# Cloud Run의 PORT 환경변수 사용, 기본값 8080
EXPOSE ${PORT:-8080}

# JVM 메모리 설정과 함께 시작
ENTRYPOINT ["sh", "-c", "java -Xmx1536m -Xms512m -Dserver.port=${PORT:-8080} -jar /app/app.jar"]