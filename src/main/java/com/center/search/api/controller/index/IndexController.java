package com.center.search.api.controller.index;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.*;
import com.center.search.view.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Controller
public class IndexController {

    private LocationService locationService;

    public IndexController(LocationService locationService) {
        this.locationService = locationService;
    }

    /*확인용*/
    @GetMapping("/login")
    public String login() {
        return "login/login";
    }

    @GetMapping("/test")
    public String testPage(){
        return "test";
    }

    @GetMapping
    public String index(Model model) {

        //model.addAttribute("clientId", mapsApiPath.getNAVER_API_KEY_ID());
        var result = locationService.findAllLocations().stream()
                .filter(Location::isActivate)
                .toList();

        model.addAttribute("locations", result);
        return "index";
    }


}
