package com.center.search.domain.service;

import com.center.search.domain.entity.Coordinate;
import com.center.search.domain.entity.LocationLatitude;
import com.center.search.domain.entity.LocationLongitude;

public interface CoordinateCalculationService {

    // 두 좌표 간 거리 계산 (미터 단위) -- 정보 추가할 때 위도/경도 중복 검사
    double calculateDistance(LocationLatitude lat1, LocationLongitude lon1,
                             LocationLatitude lat2, LocationLongitude lon2);

    // 지정된 범위 내에 있는지 체크 -- 정보 추가할 때 위도/경도 중복 검사
    boolean isWithinRange(LocationLatitude lat1, LocationLongitude lon1,
                          LocationLatitude lat2, LocationLongitude lon2,
                          double rangeInMeters);

    // 주소를 좌표로 변환 (외부 API 활용)
    Coordinate convertAddressToCoordinate(String address);

}