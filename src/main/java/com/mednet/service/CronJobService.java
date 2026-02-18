package com.mednet.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.*;

@Service
public class CronJobService {

    private ScheduledExecutorService scheduler;
    private ScheduledFuture<?> scheduledTask;
    private String currentInterval = "STOPPED";
    private String lastRunTime = "Never";


    public void startScheduler(long intervalMs) {
        stopScheduler();

        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduledTask = scheduler.scheduleAtFixedRate(() -> {
            lastRunTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }, 0, intervalMs, TimeUnit.MILLISECONDS);

        currentInterval = formatInterval(intervalMs);
    }


    public void stopScheduler() {
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(false);
        }
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
        }
        currentInterval = "STOPPED";
    }


    public String getStatus() {
        return currentInterval;
    }

    public String getLastRunTime() {
        return lastRunTime;
    }


    public boolean isRunning() {
        return scheduledTask != null && !scheduledTask.isCancelled();
    }


    private String formatInterval(long ms) {
        if (ms < 1000) return ms + " ms";
        if (ms < 60000) return (ms / 1000) + " sec";
        return (ms / 60000) + " min";
    }
}
