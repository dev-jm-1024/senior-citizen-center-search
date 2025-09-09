package com.center.search.application.viewmodel;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.CenterUpdateVmService;
import com.center.search.domain.service.LocationService;
import com.center.search.view.CenterUpdateVM;
import org.springframework.stereotype.Service;

@Service
public class CenterUpdateVmServiceImpl implements CenterUpdateVmService {

    private final LocationService locationService;

    public CenterUpdateVmServiceImpl(LocationService locationService) {
        this.locationService = locationService;
    }

    @Override
    public CenterUpdateVM getCenterUpdateVM(Long id) {
        return locationService.findLocationById(id)       // Optional<Location>
                .filter(Location::isActivate)
                .map(loc -> new CenterUpdateVM(
                        loc.getId(),
                        loc.getLocationName(),
                        loc.getLocationNumber(),
                        loc.getLocationAddress()
                ))
                .orElse(null);
    }

}
