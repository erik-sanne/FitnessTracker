package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Log4j2
public final class RegistrationCompleteListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    @Autowired
    private EmailVerificationService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void onApplicationEvent(final OnRegistrationCompleteEvent event) {
        log.info("Preparing email for to activate account for {}", event.getUser().getEmail());
        User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        emailService.createEmailVerificationToken(user, token);

        String recipient = user.getEmail();
        String subject = "Confirm email";
        String url = String.format("%s/%s?", "https://tracker.erik-sanne.com/activate", token);

        //TODO: use message template, take a look at MessageSource
        String message = String.format("%s %s",
                "Hi! Welcome to Tracker! To finish your registration, please visit the following link:",
                url);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("no-reply@erik-sanne.com");
        mail.setTo(recipient);
        mail.setSubject(subject);
        mail.setText(message);
        mailSender.send(mail);
        log.info("Email sent!");
    }
}
