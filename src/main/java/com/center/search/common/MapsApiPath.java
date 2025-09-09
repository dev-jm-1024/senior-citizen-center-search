package com.center.search.common;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public final class MapsApiPath {

    @Value("${ncp.maps.api.static-map}")
    private String staticMap;

    @Value("${ncp.maps.api.directions-5}")
    private String direction5;

    @Value("${ncp.maps.api.directions-15}")
    private String direction15;

    private final String naverGeocodingApiPath =
            "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";


    @Value("${ncp.maps.api.reverse-geocoding}")
    private String reverseGeocoding;

    @Value("${ncp.maps.api.client-id}")
    private String NAVER_API_KEY_ID;

    @Value("${ncp.maps.api.client-secret}")
    private String NAVER_API_KEY;

    @Value("${kakao.rest.api.key}")
    private String kakaoRestApiKey;

    @Value("${kakao.js.api.key}")
    private String kakaoJsApiKey;
}