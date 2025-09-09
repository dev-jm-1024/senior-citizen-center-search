package com.center.search.api.controller.location;

import com.center.search.application.location.SearchService;
import com.center.search.domain.dto.LocationMarkerDto;
import com.center.search.domain.entity.Location;
import com.center.search.domain.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/location")
public class RestLocationController {

    private final LocationService locationService;
    private final SearchService searchService;

    public RestLocationController(LocationService locationService, SearchService searchService) {
        this.locationService = locationService;
        this.searchService = searchService;
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<LocationMarkerDto>> getAllLocations() {
        // 가정: locationService.findAllLocations() → List<Location>
        List<Location> all = locationService.findAllLocations();

        List<LocationMarkerDto> markers = all.stream()
                .filter(Location::isActivate) // 활성화만 노출
                .map(loc -> new LocationMarkerDto(
                        loc.getId(),
                        // 값 객체에서 실제 값을 꺼내 주세요.
                        // 접근자 이름은 프로젝트에 맞게 조정 (value(), getValue(), toString 등)
                        loc.getLocationName().getLocationName(),
                        loc.getLocationNumber().getLocationNumber(),
                        loc.getLocationAddress().getAddress(),
                        loc.getLatitude().getLatitude(),
                        loc.getLongitude().getLongitude()
                ))
                .toList();

        return ResponseEntity.ok(markers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable("id") Long locationId){

        Optional<Location> locationOpt = locationService.findLocationById(locationId);
        if(locationOpt.isPresent()){
            return ResponseEntity.ok(locationOpt.get());
        }else{
            return ResponseEntity.notFound().build();
        }

    }

    // 새로 추가: 검색
    @GetMapping("/search")
    public ResponseEntity<List<LocationMarkerDto>> searchLocations(
            @RequestParam(value = "q") String search) {

        if (search == null || search.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Location> results = searchService.searchLocations(search);

            List<LocationMarkerDto> markers = results.stream()
                    .map(loc -> new LocationMarkerDto(
                            loc.getId(),
                            loc.getLocationName().getLocationName(),
                            loc.getLocationNumber().getLocationNumber(),
                            loc.getLocationAddress().getAddress(),
                            loc.getLatitude().getLatitude(),
                            loc.getLongitude().getLongitude()
                    ))
                    .toList();

            return ResponseEntity.ok(markers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
