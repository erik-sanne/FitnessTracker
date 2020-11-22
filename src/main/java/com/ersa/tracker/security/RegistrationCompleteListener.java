package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.services.EmailVerificationService;
import com.ersa.tracker.services.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RegistrationCompleteListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    @Autowired
    private EmailVerificationService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        emailService.createEmailVerificationToken(user, token);

        String recipient = user.getEmail();
        String subject = "Confirm email";
        String url = String.format("%s/%s?", event.getUrl(), "confirmEmail", token);

        //TODO: use message template, take a look at MessageSource
        String message = String.format("%s/r/n%s/r/n%s", "Hi,", "Nice of you to sign up. To finish your registration, click the link below", url);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(recipient);
        mail.setSubject(subject);
        mail.setText(message);
        mailSender.send(mail);
    }
}
