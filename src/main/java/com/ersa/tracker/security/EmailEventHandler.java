package com.ersa.tracker.security;

import com.ersa.tracker.models.authentication.User;
import com.ersa.tracker.models.user.UserProfile;
import com.ersa.tracker.security.exceptions.ResourceNotFoundException;
import com.ersa.tracker.services.authentication.EmailVerificationService;
import com.ersa.tracker.services.authentication.UserManagementService;
import com.ersa.tracker.utils.DateUtils;
import com.ersa.tracker.utils.EmailFormatter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@Log4j2
public final class EmailEventHandler implements ApplicationListener<SendEmailEvent> {

    private EmailVerificationService emailService;
    private JavaMailSender mailSender;
    private EmailFormatter emailFormatter;

    private final String EMAIL_VERIFICATION_LINK_BASE = "https://tracker.erik-sanne.com/activate";
    private final String FORGOT_PASSWORD_LINK_BASE = "https://tracker.erik-sanne.com/change-password"; //For forgot pass, but should be "change-password" in browser field

    @Autowired
    public EmailEventHandler(EmailVerificationService emailService, EmailFormatter emailFormatter, JavaMailSender mailSender) {
        this.emailService = emailService;
        this.mailSender = mailSender;
        this.emailFormatter = emailFormatter;
    }

    @Override
    public void onApplicationEvent(final SendEmailEvent event) {
        log.info("Preparing email for {} due to {}", event.getEmail() != null ? event.getEmail() : event.getUser().getEmail(), event.getEventType());

        switch (event.getEventType()) {
            case RegistrationComplete -> sendRegistrationVerification(event);
            case RequestEmailChange -> sendChangeEmailVerification(event);
            case ForgotPassword -> sendForgotPassword(event);
        }
    }

    private void sendRegistrationVerification(final SendEmailEvent event) {
        User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        emailService.createEmailVerificationToken(user, event.getEmail(), token);

        String verificationLink = String.format("%s/%s?", EMAIL_VERIFICATION_LINK_BASE, token);

        String recipient = event.getEmail();

        String subject = "Activate your account";
        String message = emailFormatter.registrationEmail()
                .withAccountId(user.getId())
                .withDate(new Date())
                .withActivationLink(verificationLink)
                .build();

        sendMail(subject, message, recipient);
    }

    private void sendChangeEmailVerification(final SendEmailEvent event) {
        User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        emailService.createEmailVerificationToken(user, event.getEmail(), token);

        String verificationLink = String.format("%s/%s?", EMAIL_VERIFICATION_LINK_BASE, token);

        String recipient = event.getEmail();

        String name = Optional.of(user.getUserProfile()).map(UserProfile::getDisplayName).orElse("Anonymous");
        String subject = "Email change request";
        String message = emailFormatter.changeEmailTemplate()
                .withName(name)
                .withAccountId(user.getId())
                .withActivationLink(verificationLink)
                .build();

        sendMail(subject, message, recipient);
    }

    private void sendForgotPassword(final SendEmailEvent event) {
        final String token = UUID.randomUUID().toString();
        try {
            emailService.createForgotPasswordToken(event.getEmail(), token);
        } catch (ResourceNotFoundException e) {
            return;
        }

        String changePasswordLink = String.format("%s/%s?", FORGOT_PASSWORD_LINK_BASE, token);
        String recipient = event.getEmail();
        String subject = "Change password";

        String message = emailFormatter.resetPasswordTemplate()
                .withResetLink(changePasswordLink)
                .withDate(DateUtils.addMinutes(new Date(), UserManagementService.CHANGE_PASSWORD_MINUTES)).build();

        sendMail(subject, message, recipient);
    }

    private void sendMail(String subject, String messageBody, String recipient) {
        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
            helper.setFrom("no-reply@erik-sanne.com");
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(messageBody, true);
            mailSender.send(mail);
            log.info("Email sent!");
        } catch (MessagingException | MailException e) {
            log.error("Failed to send email", e);
        }
    }
}
