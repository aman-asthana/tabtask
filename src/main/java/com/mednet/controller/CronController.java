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

    // Start cron job with expression
    @PostMapping("/start")
    public Map<String, Object> startCronJob(@RequestParam String expression) {
        Map<String, Object> response = new HashMap<>();
        try {
            cronJobService.startCronJob(expression);
            response.put("success", true);
            response.put("running", true);
            response.put("expression", expression);
            response.put("message", "Cron job started with CronTrigger");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid cron expression: " + e.getMessage());
        }
        return response;
    }

    // Stop cron job
    @PostMapping("/stop")
    public Map<String, Object> stopCronJob() {
        Map<String, Object> response = new HashMap<>();
        cronJobService.stopCronJob();
        response.put("success", true);
        response.put("running", false);
        response.put("message", "Cron job stopped");
        return response;
    }

    // Get status
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("running", cronJobService.isRunning());
        response.put("expression", cronJobService.getCurrentExpression());
        return response;
    }

    // Get logs
    @GetMapping("/logs")
    public Map<String, Object> getLogs() {
        Map<String, Object> response = new HashMap<>();
        response.put("logs", cronJobService.getLogs());
        return response;
    }

    // Clear logs
    @PostMapping("/clear")
    public Map<String, Object> clearLogs() {
        Map<String, Object> response = new HashMap<>();
        cronJobService.clearLogs();
        response.put("success", true);
        return response;
    }
}
