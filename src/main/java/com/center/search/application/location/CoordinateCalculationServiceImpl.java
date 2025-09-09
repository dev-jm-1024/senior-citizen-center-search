package com.center.search.application.location;

import com.center.search.domain.entity.Coordinate;
import com.center.search.domain.entity.LocationLatitude;
import com.center.search.domain.entity.LocationLongitude;
import com.center.search.domain.service.CoordinateCalculationService;
import com.center.search.common.MapsApiPath;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import java.util.Map;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CoordinateCalculationServiceImpl implements CoordinateCalculationService {

    private final MapsApiPath mapsApiPath;
    private final RestTemplate restTemplate = new RestTemplate();

    public CoordinateCalculationServiceImpl(MapsApiPath mapsApiPath) {
        this.mapsApiPath = mapsApiPath;
    }

    @Override
    public double calculateDistance(LocationLatitude lat1, LocationLongitude lon1, LocationLatitude lat2, LocationLongitude lon2) {
        double lat1Rad = Math.toRadians(lat1.getLatitude());
        double lon1Rad = Math.toRadians(lon1.getLongitude());
        double lat2Rad = Math.toRadians(lat2.getLatitude());
        double lon2Rad = Math.toRadians(lon2.getLongitude());

        double deltaLat = lat2Rad - lat1Rad;
        double deltaLon = lon2Rad - lon1Rad;

        // Haversine 공식
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // 지구 반지름 (미터)
        double earthRadius = 6371000;

        return earthRadius * c;
    }

    @Override
    public boolean isWithinRange(LocationLatitude lat1, LocationLongitude lon1,
                                 LocationLatitude lat2, LocationLongitude lon2,
                                 double rangeInMeters) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= rangeInMeters;
    }

    @Override
    public Coordinate convertAddressToCoordinate(String address) {
        try {
            String normalizedAddress = normalizeAddress(address);
            String encodedAddress = URLEncoder.encode(normalizedAddress, "UTF-8");
            String apiURL = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=" + encodedAddress;

            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", mapsApiPath.getNAVER_API_KEY_ID());
            con.setRequestProperty("X-NCP-APIGW-API-KEY", mapsApiPath.getNAVER_API_KEY());

            int responseCode = con.getResponseCode();
            BufferedReader br;

            if (responseCode == 200) {
                br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();

            // JSON 파싱 (기존 Map 방식 유지)
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseBody = mapper.readValue(response.toString(), Map.class);

            if ("OK".equals(responseBody.get("status"))) {
                List<Map<String, Object>> addresses = (List<Map<String, Object>>) responseBody.get("addresses");

                if (addresses != null && !addresses.isEmpty()) {
                    Map<String, Object> firstAddress = addresses.get(0);
                    String x = (String) firstAddress.get("x");
                    String y = (String) firstAddress.get("y");

                    double longitude = Double.parseDouble(x);
                    double latitude = Double.parseDouble(y);

                    return new Coordinate(longitude, latitude);
                }
            }

            throw new RuntimeException("주소를 좌표로 변환할 수 없습니다: " + address);

        } catch (Exception e) {
            throw new RuntimeException("Geocoding API 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }

    // 주소 정규화 메서드 추가
    private String normalizeAddress(String address) {
        return address.replaceFirst("^경기\\s+", "").trim();
    }


}
