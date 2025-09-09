package com.center.search.api.controller.index;

import com.center.search.domain.service.CenterDetailVmService;
import com.center.search.domain.service.CenterUpdateVmService;
import com.center.search.view.CenterDetailVM;
import com.center.search.view.CenterUpdateVM;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/center")
public class CenterManageController {

    private final CenterDetailVmService centerViewVmService;
    private final CenterUpdateVmService centerUpdateVmService;

    public CenterManageController(CenterDetailVmService centerViewVmService,
                                  CenterUpdateVmService centerUpdateVmService) {
        this.centerViewVmService = centerViewVmService;
        this.centerUpdateVmService = centerUpdateVmService;
    }

    @GetMapping("/create")
    public String viewCenterCreate() {
        return "center/center-create";
    }

    @GetMapping("/view/{locationId}")
    public String viewCenterDetail(@PathVariable("locationId") Long locationId, Model model) {
        CenterDetailVM vm = centerViewVmService.getCenterViewVM(locationId);
        model.addAttribute("vm", vm);
        return "center/center-detail";
    }

    @GetMapping("/{id}/update")
    public String viewCenterUpdate(@PathVariable("id") Long id, Model model){
        CenterUpdateVM vm = centerUpdateVmService.getCenterUpdateVM(id);
        model.addAttribute("vm", vm);
        return "center/center-update";
    }

}
