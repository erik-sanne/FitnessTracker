package com.ersa.tracker.tasks;

import com.ersa.tracker.services.general.season.SeasonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SeasonTask {

    private final SeasonService seasonService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void executeTask() {
        log.info("Starting task to manage current season");
        manageWeeks();
        preComputeScores();
        log.info("Task complete");
    }

    private void manageWeeks() {
        seasonService.manageWeeks();
    }

    private void preComputeScores() {
        seasonService.preComputeScores();
    }

}
