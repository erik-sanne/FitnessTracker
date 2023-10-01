package com.ersa.tracker.tasks.dev;

import com.ersa.tracker.tasks.SeasonTask;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("dev")
@Component
@Slf4j
public class LocalDevTaskRunner {

    public LocalDevTaskRunner(SeasonTask seasonTask) {
        log.info("Development profile active. Will start dev tasks");
        seasonTask.executeTask();
    }
}
