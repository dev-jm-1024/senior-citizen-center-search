package com.center.search.api.controller.index;

import com.center.search.application.location.NaverDirectionsService;
import com.center.search.domain.dto.RouteResponse;
import com.center.search.domain.service.CenterDetailVmService;
import com.center.search.domain.service.CenterLocateService;
import com.center.search.domain.service.NavigateVmService;
import com.center.search.domain.service.QuarterVmService;
import com.center.search.view.CenterDetailVM;
import com.center.search.view.CenterLocateVM;
import com.center.search.view.Navigate;
import com.center.search.view.QuarterVM;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.io.UnsupportedEncodingException;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/center")
public class CenterLocationController {

    private final QuarterVmService quarterVmService;
    private final CenterLocateService centerLocateService;
    private final NaverDirectionsService naverDirectionsService;
    private final NavigateVmService navigateVmService;


    public CenterLocationController(QuarterVmService quarterVmService, CenterLocateService centerLocateService,
                                    NaverDirectionsService naverDirectionsService,
                                    NavigateVmService navigateVmService) {
        this.quarterVmService = quarterVmService;
        this.centerLocateService = centerLocateService;
        this.naverDirectionsService = naverDirectionsService;
        this.navigateVmService = navigateVmService;
    }

    @GetMapping("/view/quarter/{area}")
    public String viewCenterQuarter(@PathVariable("area") String area, Model model) {
        List<QuarterVM> vm = quarterVmService.getQuarterVMs(area);
        model.addAttribute("vm", vm);
        return "center/center-seongnam-quarter";
    }

    @GetMapping("/choose/locate")
    public String viewCenterChooseLocate(Model model){
        Map<String, List<CenterLocateVM>> vm = centerLocateService.getCenterLocateGroup();
        model.addAttribute("vm", vm);
        return "center/center-choose-locate";
    }

    @GetMapping("/locate")
    public String viewCenterLocate(@RequestParam("ids") List<Long> ids, Model model){
        List<CenterLocateVM> vm = centerLocateService.getSelectedCenterLocates(ids);
        model.addAttribute("vm", vm);
        return "center/center-locate";
    }

    @GetMapping("/nav/start")
    public String viewCenterNavStart(Model model){

        //지역별로 경로당 보여주기
        Map<String, List<CenterLocateVM>> vm = centerLocateService.getCenterLocateGroup();
        model.addAttribute("vm", vm);

        return "center/navigation/center-start";
    }

    @GetMapping("/nav/waypoints")
    public String viewCenterNavWaypoints(@RequestParam String start,
                                         @RequestParam String startName,
                                         Model model){
        Map<String, List<CenterLocateVM>> vm = centerLocateService.getCenterLocateGroup();
        model.addAttribute("vm", vm);


        Navigate hidden = navigateVmService.getStartData(start, startName);
        model.addAttribute("hidden", hidden);

        return "center/navigation/center-waypoints";
    }

    @GetMapping("/nav/goal")
    public String viewCenterNavGoal(@RequestParam String start,
                                     @RequestParam String startName,
                                     @RequestParam(required = false) String waypoints,
                                     @RequestParam(required = false) String waypointNames,
                                     Model model){
        Map<String, List<CenterLocateVM>> vm = centerLocateService.getCenterLocateGroup();
        model.addAttribute("vm", vm);


        Navigate hidden = navigateVmService.getStartAndWaypointsData(start, startName, waypoints, waypointNames);

        model.addAttribute("hidden", hidden);

        return "center/navigation/center-goal";
    }


    @GetMapping("/nav/result")
    public String viewCenterNavResult(@RequestParam String start,
                                      @RequestParam String startName,
                                      @RequestParam(required = false) String waypoints,
                                      @RequestParam(required = false) String waypointNames,
                                      @RequestParam String goal,
                                      @RequestParam String goalName,
                                      Model model) {
        try {
            // URL 파라미터는 이미 인코딩되어 있으므로 디코딩 후 사용
            String decodedStart = URLDecoder.decode(start, "UTF-8");
            String decodedWaypoints = waypoints != null && !waypoints.isEmpty() && !waypoints.equals("null")
                    ? URLDecoder.decode(waypoints, "UTF-8") : null;
            String decodedGoal = URLDecoder.decode(goal, "UTF-8");

            // NAVER Directions API 호출 (디코딩된 값 사용)
            RouteResponse response = naverDirectionsService.getRoute(decodedStart, decodedWaypoints, decodedGoal);

            if (response != null && response.getRoute() != null &&
                    response.getRoute().getTraoptimal() != null &&
                    !response.getRoute().getTraoptimal().isEmpty() &&
                    response.getCode() == 0) {

                RouteResponse.TraOptimal optimal = response.getRoute().getTraoptimal().get(0);
                RouteResponse.TraOptimal.Summary summary = optimal.getSummary();
                List<RouteResponse.TraOptimal.Guide> guides = optimal.getGuide();

                // 결과 데이터를 모델에 추가
                model.addAttribute("distance", summary.getDistance());
                model.addAttribute("duration", summary.getDuration());
                model.addAttribute("tollFare", summary.getTollFare());
                model.addAttribute("fuelPrice", summary.getFuelPrice());
                model.addAttribute("guides", guides);

                // path 데이터 추가 (경로 좌표들)
                List<List<Double>> pathCoords = optimal.getPath();
                model.addAttribute("pathCoords", pathCoords);

            } else {
                String errorMsg = "경로를 찾을 수 없습니다";
                if (response != null) {
                    errorMsg += ". 응답 코드: " + response.getCode() + ", 메시지: " + response.getMessage();
                }
                model.addAttribute("error", errorMsg);
            }

        } catch (UnsupportedEncodingException e) {
            model.addAttribute("error", "인코딩 처리 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            model.addAttribute("error", "경로 검색 중 오류가 발생했습니다: " + e.getMessage());
        }

        // 화면 표시용 데이터
        model.addAttribute("start", start);
        model.addAttribute("startName", startName);
        model.addAttribute("waypoints", waypoints);
        model.addAttribute("waypointNames", waypointNames);
        model.addAttribute("goal", goal);
        model.addAttribute("goalName", goalName);

        return "center/navigation/center-nav-result";
    }
}
