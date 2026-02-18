package com.mednet.controller;

import com.mednet.service.CronJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cron")
public class CronController {

    @Autowired
    private CronJobService cronJobService;

    // Start scheduler with given interval (in milliseconds)
    @PostMapping("/start")
    public Map<String, Object> startScheduler(@RequestParam long interval) {
        cronJobService.startScheduler(interval);
        return getStatusResponse("Scheduler started");
    }

    // Stop the scheduler
    @PostMapping("/stop")
    public Map<String, Object> stopScheduler() {
        cronJobService.stopScheduler();
        return getStatusResponse("Scheduler stopped");
    }

    // Get current status
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        return getStatusResponse(null);
    }

    // Helper to build response
    private Map<String, Object> getStatusResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("running", cronJobService.isRunning());
        response.put("interval", cronJobService.getStatus());
        response.put("lastRunTime", cronJobService.getLastRunTime());
        if (message != null) {
            response.put("message", message);
        }
        return response;
    }
}
