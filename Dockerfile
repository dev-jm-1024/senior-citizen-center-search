FROM eclipse-temurin:17-jre-alpine
LABEL authors="JM"

WORKDIR /app
# JAR 한 개만 확실히 집도록 패턴 조정(원하는 이름으로 바꿔도 됨)
COPY build/libs/*-SNAPSHOT.jar app.jar

# EXPOSE는 있어도 되고 없어도 됩니다(Cloud Run은 무시)
# EXPOSE 8080

# Cloud Run이 주는 PORT(미지정시 8080)로 바인딩
ENTRYPOINT ["sh","-c","java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
