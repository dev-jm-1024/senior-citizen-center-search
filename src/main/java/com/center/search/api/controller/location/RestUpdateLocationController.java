package com.center.search.api.controller.location;

import com.center.search.domain.dto.LocationCreateRequest;
import com.center.search.domain.entity.Location;
import com.center.search.domain.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/location")
public class RestUpdateLocationController {

    private final LocationService locationService;

    public RestUpdateLocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<?> updateLocation(@PathVariable("id") Long locationId, @ModelAttribute LocationCreateRequest locationCreateRequest){

        try{
            Location result = locationService.updateLocation(locationId, locationCreateRequest);
            return ResponseEntity.ok(result);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("DB 에러");
        }
    }


    @PostMapping("/{id}/change/status")
    public ResponseEntity<?> changeStatus(@PathVariable("id") Long locationId){

        try{
            locationService.replaceLocationStatus(locationId, 0);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("DB 에러");
        }

        return ResponseEntity.status(HttpStatus.OK).body("성공적으로 변경되었습니다");
    }
}
