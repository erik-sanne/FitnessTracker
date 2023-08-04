package com.ersa.tracker.tasks;

import com.ersa.tracker.models.PersistedLogEvent;
import com.ersa.tracker.models.authentication.ChangePasswordToken;
import com.ersa.tracker.models.authentication.EmailVerificationToken;
import com.ersa.tracker.repositories.PersistantLogRepository;
import com.ersa.tracker.repositories.authentication.ChangePasswordTokenRepository;
import com.ersa.tracker.repositories.authentication.EmailVerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;


@Component
@Slf4j
@RequiredArgsConstructor
public class CleanupExpiredTokensTask {

    private final PersistantLogRepository logRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final ChangePasswordTokenRepository changePasswordTokenRepository;

    @Scheduled(cron = "0 0 1 * * ?")
    public void executeTask() {
        log.info("Starting task to clean up expired tokens");
        cleanupExpiredEmailTokens();
        cleanupExpiredChangePasswordTokens();
        log.info("Task complete");
    }

    private void cleanupExpiredEmailTokens() {
        Iterable<EmailVerificationToken> iterable = emailVerificationTokenRepository.findAll();
        Stream<EmailVerificationToken> emailTokens = StreamSupport.stream(iterable.spliterator(), false);
        List<EmailVerificationToken> expiredEmailTokens = emailTokens.filter(token -> new Date().after(token.getExpiryDate())).toList();

        if (expiredEmailTokens.size() > 0) {
            String message = String.format("Removed %s expired email verification tokens", expiredEmailTokens.size());
            emailVerificationTokenRepository.deleteAll(expiredEmailTokens);
            log(message);
        }
    }

    private void cleanupExpiredChangePasswordTokens() {
        Iterable<ChangePasswordToken> iterable = changePasswordTokenRepository.findAll();
        Stream<ChangePasswordToken> changePasswordTokens = StreamSupport.stream(iterable.spliterator(), false);
        List<ChangePasswordToken> expiredChangePasswordTokens = changePasswordTokens.filter(token -> new Date().after(token.getExpiryDate())).toList();

        if (expiredChangePasswordTokens.size() > 0) {
            String message = String.format("Removed %s expired change password tokens", expiredChangePasswordTokens.size());
            changePasswordTokenRepository.deleteAll(expiredChangePasswordTokens);
            log(message);
        }
    }

    private void log(String message) {
        log.info(message);
        PersistedLogEvent logEvent = new PersistedLogEvent();
        logEvent.setTime(new Date());
        logEvent.setMessage(message);
        logRepository.save(logEvent);
    }

}
