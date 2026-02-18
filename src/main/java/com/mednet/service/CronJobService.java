package com.mednet.service;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ScheduledFuture;

@Service
public class CronJobService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private StringBuilder logs = new StringBuilder();

    private TaskScheduler taskScheduler;
    private ScheduledFuture<?> scheduledFuture;
    private String currentExpression = "";

    // Initialize TaskScheduler
    private TaskScheduler getTaskScheduler() {
        if (taskScheduler == null) {
            ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
            scheduler.setPoolSize(1);
            scheduler.setThreadNamePrefix("CronJob-");
            scheduler.initialize();
            taskScheduler = scheduler;
        }
        return taskScheduler;
    }

    // Start cron job with CronTrigger
    public void startCronJob(String cronExpression) {
        stopCronJob(); // Stop existing job if any

        CronTrigger cronTrigger = new CronTrigger(cronExpression);

        scheduledFuture = getTaskScheduler().schedule(() -> {
            String time = LocalDateTime.now().format(formatter);
            String logLine = "Hello World! - " + time;
            logs.append(logLine).append("\n");
        }, cronTrigger);

        currentExpression = cronExpression;
        logs.append("--- Cron Job Started: " + cronExpression + " ---\n");
    }

    // Stop cron job
    public void stopCronJob() {
        if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
            scheduledFuture.cancel(false);
            logs.append("--- Cron Job Stopped ---\n");
        }
        currentExpression = "";
    }

    // Check if running
    public boolean isRunning() {
        return scheduledFuture != null && !scheduledFuture.isCancelled() && !scheduledFuture.isDone();
    }

    // Get current expression
    public String getCurrentExpression() {
        return currentExpression;
    }

    // Get logs
    public String getLogs() {
        return logs.toString();
    }

    // Clear logs
    public void clearLogs() {
        logs = new StringBuilder();
    }
}
