package com.center.search.api.controller.location;

import com.center.search.domain.dto.LocationCreateRequest;
import com.center.search.domain.entity.*;
import com.center.search.domain.repo.LocationRepo;
import com.center.search.domain.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/location")
public class RestCreateLocationController {

    private final LocationService locationService;
    private final LocationRepo locationRepo;



    public RestCreateLocationController(LocationService locationService, LocationRepo locationRepo) {
        this.locationService = locationService;
        this.locationRepo = locationRepo;
    }

    @PostMapping
    public ResponseEntity<?> createLocation(@ModelAttribute LocationCreateRequest locationCreateRequest){
        System.out.println("=== 요청 데이터 ===");
        System.out.println("locationName: " + locationCreateRequest.getLocationName());
        System.out.println("locationNumber: " + locationCreateRequest.getLocationNumber());
        System.out.println("locationAddress: " + locationCreateRequest.getLocationAddress());

        try {
            Location result = locationService.createLocation(locationCreateRequest);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            System.out.println("IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception 발생:");
            e.printStackTrace(); // 전체 스택 트레이스 출력
            return ResponseEntity.internalServerError().body("위치 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

}


