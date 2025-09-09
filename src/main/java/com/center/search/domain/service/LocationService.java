package com.center.search.domain.service;

import com.center.search.domain.dto.LocationCreateRequest;
import com.center.search.domain.entity.Location;

import java.util.List;
import java.util.Optional;

public interface LocationService {

    // 생성 (Create)
    Location createLocation(LocationCreateRequest locationCreateRequest);

    // 조회 (Read)
    Optional<Location> findLocationById(Long id);
    List<Location> findAllLocations();

    // 수정 (Update)
    Location updateLocation(Long id, LocationCreateRequest locationCreateRequest);

    // 상태 변경
    void replaceLocationStatus(Long id, int status);

    // 중복 검사
    boolean isDuplicateLocation(LocationCreateRequest locationCreateRequest);

    List<Location> findAllByIdInAndStatus(List<Long> ids, int status);
}