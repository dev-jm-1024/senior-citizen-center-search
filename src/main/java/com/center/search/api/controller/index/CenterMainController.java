package com.center.search.api.controller.index;

import com.center.search.domain.service.CenterMainVmService;
import com.center.search.view.CenterMainVM;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/center")
public class CenterMainController {

    private final CenterMainVmService centerMainVmService;

    public CenterMainController(CenterMainVmService centerMainVmService) {
        this.centerMainVmService = centerMainVmService;
    }

    @GetMapping("/main")
    public String viewCenterMain(Model model) {

        Map<String, List<CenterMainVM>> vm = centerMainVmService.getCenterMainVMs();
        model.addAttribute("vm", vm);
        return "center/center-main";
    }

}
