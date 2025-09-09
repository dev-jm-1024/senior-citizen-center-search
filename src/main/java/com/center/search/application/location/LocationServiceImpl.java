package com.center.search.application.location;

import com.center.search.domain.dto.LocationCreateRequest;
import com.center.search.domain.entity.*;
import com.center.search.domain.repo.LocationRepo;
import com.center.search.domain.service.CoordinateCalculationService;
import com.center.search.domain.service.LocationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LocationServiceImpl implements LocationService {

    private final LocationRepo locationRepo;
    private final CoordinateCalculationService coordinateCalculationService;

    public LocationServiceImpl(LocationRepo locationRepo,
                               CoordinateCalculationService coordinateCalculationService) {
        this.locationRepo = locationRepo;
        this.coordinateCalculationService = coordinateCalculationService;
    }

    @Override
    public Location createLocation(LocationCreateRequest locationCreateRequest) {

        // 중복 체크
        if (isDuplicateLocation(locationCreateRequest)) {
            throw new IllegalArgumentException("Duplicate location exists");
        }

        // 주소를 좌표로 변환
        Coordinate coordinate = coordinateCalculationService
                .convertAddressToCoordinate(locationCreateRequest.getLocationAddress());

        // Value Object 생성
        LocationNumber locationNumber = LocationNumber.createLocationNumber(locationCreateRequest.getLocationNumber());
        LocationName locationName = LocationName.create(locationCreateRequest.getLocationName());
        LocationAddress locationAddress = LocationAddress.create(locationCreateRequest.getLocationAddress());
        LocationLatitude latitude = LocationLatitude.create(coordinate.latitude());
        LocationLongitude longitude = LocationLongitude.create(coordinate.longitude());

        // Location 엔티티 생성
        Location location = new Location(locationNumber, locationName, locationAddress,
                latitude, longitude, 1); // 기본값: 활성

        return locationRepo.save(location);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Location> findLocationById(Long id) {
        return locationRepo.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Location> findAllLocations() {
        return locationRepo.findAll();
    }

    @Override
    public Location updateLocation(Long id, LocationCreateRequest locationCreateRequest) {
        Location existingLocation = locationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Location not found with id: " + id));

        Coordinate coordinate = coordinateCalculationService
                .convertAddressToCoordinate(locationCreateRequest.getLocationAddress());

        // Value Object들의 update 메서드 활용
        LocationNumber newLocationNumber = LocationNumber.createLocationNumber(locationCreateRequest.getLocationNumber());
        LocationName newLocationName = LocationName.create(locationCreateRequest.getLocationName());
        LocationAddress newLocationAddress = LocationAddress.create(locationCreateRequest.getLocationAddress());
        LocationLatitude newLatitude = LocationLatitude.create(coordinate.latitude());
        LocationLongitude newLongitude = LocationLongitude.create(coordinate.longitude());

        // 기존 엔티티 업데이트
        existingLocation.updateWith(newLocationNumber, newLocationName, newLocationAddress,
                newLatitude, newLongitude);

        return locationRepo.save(existingLocation);
    }

    @Override
    public void replaceLocationStatus(Long id, int status) {
        Location location = locationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Location not found with id: " + id));
        try{
            int result = locationRepo.updateLocationStatus(0 , id);
            if(result == 0){
                throw new IllegalArgumentException("Location not found with id: " + id);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @Override
    @Transactional(readOnly = true)
    public boolean isDuplicateLocation(LocationCreateRequest locationCreateRequest) {
        String address = locationCreateRequest.getLocationAddress();

        // 1단계: 주소 기준 중복 체크
        List<Location> locationsWithSameAddress = locationRepo.findAll()
                .stream()
                .filter(location -> location.getLocationAddress().toString().equals(address))
                .filter(location -> location.getStatus() == 1)
                .toList();

        if (!locationsWithSameAddress.isEmpty()) {
            return true;
        }

        // 2단계: 좌표 기준 중복 체크 (예외 처리 추가)
        try {
            Coordinate newCoordinate = coordinateCalculationService
                    .convertAddressToCoordinate(address);

            LocationLatitude newLatitude = LocationLatitude.create(newCoordinate.latitude());
            LocationLongitude newLongitude = LocationLongitude.create(newCoordinate.longitude());

            return locationRepo.findAll()
                    .stream()
                    .filter(location -> location.getStatus() == 1)
                    .anyMatch(location ->
                            coordinateCalculationService.isWithinRange(
                                    newLatitude, newLongitude,
                                    location.getLatitude(), location.getLongitude(),
                                    10.0
                            )
                    );
        } catch (Exception e) {
            System.out.println("좌표 기반 중복 체크 실패, 주소 기반 체크만 수행: " + e.getMessage());
            return false; // 좌표 변환 실패시 중복 아님으로 처리
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Location> findAllByIdInAndStatus(List<Long> ids, int status) {
        return locationRepo.findAllByIdInAndStatus(ids, status);
    }
}