package com.center.search.application.location;

import com.center.search.domain.dto.RouteResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URLEncoder;
import java.io.UnsupportedEncodingException;

@Service
public class NaverDirectionsService {

    @Value("${ncp.maps.api.client-id}")
    private String clientId;

    @Value("${ncp.maps.api.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;
    private static final String NAVER_DIRECTIONS_URL = "https://maps.apigw.ntruss.com/map-direction-15/v1/driving"; // ? 제거

    public NaverDirectionsService() {
        this.restTemplate = new RestTemplate();
    }

    public RouteResponse getRoute(String start, String waypoints, String goal) {
        try {
            String url = buildApiUrl(start, waypoints, goal);
            System.out.println("=== API 호출 URL ===");
            System.out.println(url); // 디버깅용

            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<RouteResponse> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, RouteResponse.class
            );

            RouteResponse body = response.getBody();
            System.out.println("=== API 응답 ===");
            System.out.println("Code: " + (body != null ? body.getCode() : "null"));
            System.out.println("Message: " + (body != null ? body.getMessage() : "null"));

            return body;

        } catch (Exception e) {
            System.out.println("API 호출 에러: " + e.getMessage());
            throw new RuntimeException("NAVER API 호출 실패: " + e.getMessage(), e);
        }
    }

    private String buildApiUrl(String start, String waypoints, String goal) {
        try {
            StringBuilder url = new StringBuilder(NAVER_DIRECTIONS_URL);
            url.append("?start=").append(URLEncoder.encode(start, "UTF-8"))
                    .append("&goal=").append(URLEncoder.encode(goal, "UTF-8"))
                    .append("&option=traoptimal");

            if (waypoints != null && !waypoints.isEmpty() && !waypoints.equals("null")) {
                url.append("&waypoints=").append(URLEncoder.encode(waypoints, "UTF-8"));
            }

            return url.toString();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("URL 인코딩 실패: " + e.getMessage(), e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-ncp-apigw-api-key-id", clientId);
        headers.set("x-ncp-apigw-api-key", clientSecret);
        return headers;
    }
}