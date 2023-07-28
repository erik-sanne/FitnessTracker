package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import com.ersa.tracker.utils.EmailFormatter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.constraints.Email;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@Log4j2
public final class MailSender implements ApplicationListener<SendEmailEvent> {

    @Autowired
    private EmailVerificationService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailFormatter emailFormatter;

    @Override
    public void onApplicationEvent(final SendEmailEvent event) {
        log.info("Preparing email for account {} due to {}", event.getUser().getId(), event.getEventType());
        User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        emailService.createEmailVerificationToken(user, event.getEmail(), token);

        String verificationLink = String.format("%s/%s?", "https://tracker.erik-sanne.com/activate", token);

        String recipient = event.getEmail();
        String subject = "";
        String message = "";

        switch (event.getEventType()) {
            case RegistrationComplete -> {
                subject = "Activate your account";
                message = emailFormatter.registrationEmail()
                        .withAccountId(user.getId())
                        .withDate(new Date())
                        .withActivationLink(verificationLink)
                        .build();
            }
            case RequestEmailChange -> {
                String name = Optional.of(user.getUserProfile()).map(UserProfile::getDisplayName).orElse("Anonymous");
                subject = "Email change request";
                message = emailFormatter.changeEmailTemplate()
                        .withName(name)
                        .withAccountId(user.getId())
                        .withActivationLink(verificationLink)
                        .build();
            }
        }


        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
            helper.setFrom("no-reply@erik-sanne.com");
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(message, true);
            mailSender.send(mail);
        } catch (MessagingException e) {
            log.error("Failed to send email while processing {} for user {}.", event.getEventType().toString(), event.getUser().getId(), e);
            e.printStackTrace();
        }

        log.info("Email sent!");
    }
}
