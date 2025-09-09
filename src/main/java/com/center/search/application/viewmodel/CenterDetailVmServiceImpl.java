package com.center.search.application.viewmodel;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.CenterDetailVmService;
import com.center.search.domain.service.LocationService;
import com.center.search.view.CenterDetailVM;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CenterDetailVmServiceImpl implements CenterDetailVmService {

    private final LocationService locationService;

    public CenterDetailVmServiceImpl(LocationService locationService) {
        this.locationService = locationService;
    }

    @Override
    public CenterDetailVM getCenterViewVM(Long id) {
        
        Optional<Location> locationOpt = locationService.findLocationById(id);
        
        return locationOpt
                .filter(Location::isActivate)
                .map(loc -> new CenterDetailVM(
                        loc.getId(),
                        loc.getLocationName(),
                        loc.getLocationNumber(),
                        loc.getLocationAddress(),
                        loc.getLatitude(),
                        loc.getLongitude()
                ))
                .orElseThrow(() -> new IllegalArgumentException("Location not found or inactive: " + id));
    }

}