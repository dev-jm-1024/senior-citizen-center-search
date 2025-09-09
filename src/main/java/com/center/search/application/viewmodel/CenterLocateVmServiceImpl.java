package com.center.search.application.viewmodel;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.CenterLocateService;
import com.center.search.domain.service.LocationService;
import com.center.search.view.CenterLocateVM;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.center.search.common.SeongnamArea.SEONGNAM_ARR;

@Service
public class CenterLocateVmServiceImpl implements CenterLocateService {

    private final LocationService locationService;

    public CenterLocateVmServiceImpl(LocationService locationService) {
        this.locationService = locationService;
    }

    @Override
    public List<CenterLocateVM> getCenterLocate() {
        List<CenterLocateVM> result =  locationService.findAllLocations().stream()
                .filter(Location::isActivate)
                .map(loc -> new CenterLocateVM(
                        loc.getId(),
                        loc.getLocationName(),
                        loc.getLocationAddress(),
                        loc.getLatitude(),
                        loc.getLongitude()
                )).collect(Collectors.toList());

        return result.isEmpty() ? null : result;
    }

    @Override
    public Map<String, List<CenterLocateVM>> getCenterLocateGroup() {

        Map<String, List<CenterLocateVM>> result = new HashMap<>();

        for (String seongnam : SEONGNAM_ARR) {
            List<Location> locations = locationService.findAllLocations();

            if (locations.isEmpty()) {
                result.put(seongnam, Collections.emptyList());
                continue;
            }

            List<CenterLocateVM> vms = locations.stream()
                    .filter(Location::isActivate)
                    .filter(loc -> loc.getLocationAddress().getAddress().contains(seongnam))
                    .map(loc -> new CenterLocateVM(
                            loc.getId(),
                            loc.getLocationName(),
                            loc.getLocationAddress(),
                            loc.getLatitude(),
                            loc.getLongitude()
                    ))
                    .collect(Collectors.toList());

            result.put(seongnam, vms);
        }

        return result.isEmpty() ? Collections.emptyMap() : result;
    }

    @Override
    public List<CenterLocateVM> getSelectedCenterLocates(List<Long> ids){
        List<Location> locations = locationService.findAllByIdInAndStatus(ids, Location.STATUS_ACTIVE);

        return locations.stream()
                .map(loc -> new CenterLocateVM(
                        loc.getId(),
                        loc.getLocationName(),
                        loc.getLocationAddress(),
                        loc.getLatitude(),
                        loc.getLongitude()
                ))
                .collect(Collectors.toList());
    }
}
