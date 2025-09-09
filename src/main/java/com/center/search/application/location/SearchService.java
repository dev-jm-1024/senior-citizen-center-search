package com.center.search.application.location;

import com.center.search.domain.entity.Location;
import com.center.search.domain.repo.LocationRepo;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final LocationRepo locationRepo;

    public SearchService(LocationRepo locationRepo) {
        this.locationRepo = locationRepo;
    }

    public List<Location> searchLocations(String keyword) {
        // 입력 검증
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }

        // 검색어 정규화
        String normalizedKeyword = keyword.trim();

        // 통합 검색 - 이미 우선순위 정렬되어 나옴
        return locationRepo.searchByKeyword(normalizedKeyword, Location.STATUS_ACTIVE);
    }

    // 추가적인 검색 메서드들 (필요시)
    public List<Location> searchByNameOnly(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return locationRepo.searchByName(keyword.trim(), Location.STATUS_ACTIVE);
    }

    public List<Location> searchByAddressOnly(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return locationRepo.searchByAddress(keyword.trim(), Location.STATUS_ACTIVE);
    }
}
