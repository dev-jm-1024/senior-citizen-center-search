package com.center.search.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteResponse {
    private int code;
    private String message;
    private String currentDateTime;
    private Route route;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Route {
        private List<TraOptimal> traoptimal;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TraOptimal {
        private Summary summary;
        private List<Guide> guide;
        private List<List<Double>> path; // 경로 좌표 배열 추가

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Summary {
            private int distance;
            private int duration;
            private int tollFare;
            private int fuelPrice;
            private String departureTime;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Guide {
            private String instructions;
            private int distance;
            private int duration;
        }
    }
}