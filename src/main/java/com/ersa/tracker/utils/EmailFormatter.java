package com.ersa.tracker.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class EmailFormatter {

    @Value("classpath:mailtemplates/registration_email.html")
    private Resource registrationTemplate;

    @Value("classpath:mailtemplates/change_email.html")
    private Resource changeEmailTemplate;

    @Value("classpath:mailtemplates/reset_password.html")
    private Resource resetPasswordTemplate;

    public Template registrationEmail() {
        return new Template(registrationTemplate);
    }

    public Template changeEmailTemplate() {
        return new Template(changeEmailTemplate);
    }

    public Template resetPasswordTemplate() {
        return new Template(resetPasswordTemplate);
    }

    public class Template {
        private String content;

        private Template(Resource resource) {
            try {
                content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            } catch (IOException exception) {
                exception.printStackTrace();
            }
        }

        public Template withName(String name) {
            content = StringUtils.replace(content, "{{NAME}}", name);
            return this;
        }

        public Template withAccountId(Long accountId) {
            content = StringUtils.replace(content, "{{ACCOUNT_ID}}", accountId.toString());
            return this;
        }

        public Template withDate(Date date) {
            content = StringUtils.replace(content, "{{DATE}}", DateUtils.FORMAT_yyyyMMddHHmm.format(date));
            return this;
        }

        public Template withActivationLink(String activationLink) {
            content = StringUtils.replace(content, "{{ACTIVATION_LINK}}", activationLink);
            return this;
        }

        public Template withResetLink(String activationLink) {
            content = StringUtils.replace(content, "{{RESET_LINK}}", activationLink);
            return this;
        }

        public Template withValidityMinutes(String activationLink) {
            content = StringUtils.replace(content, "{{VALID_MINUTES}}", activationLink);
            return this;
        }

        public String build() {
            return content;
        }
    }
}
