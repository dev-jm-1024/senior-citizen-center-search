package com.center.search.application.viewmodel;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.LocationService;
import com.center.search.domain.service.QuarterVmService;
import com.center.search.view.QuarterVM;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.center.search.common.SeongnamArea.*;


@Service
public class QuarterVmServiceImpl implements QuarterVmService {

    private final LocationService locationService;

    public QuarterVmServiceImpl(LocationService locationService) {
        this.locationService = locationService;
    }

    @Override
    public List<QuarterVM> getQuarterVMs(String area) {

        return locationService.findAllLocations().stream()
                .filter(Location::isActivate)
                .filter(loc -> loc.getLocationAddress().getAddress().contains(area)) // area 필터 추가
                .map(loc -> new QuarterVM(
                        SEONGNAM_S,
                        SEONGNAM_B,
                        SEONGNAM_J,
                        loc.getId(),
                        loc.getLocationName(),
                        loc.getLocationNumber(),
                        loc.getLocationAddress()
                ))
                .collect(Collectors.toList());
    }


}
