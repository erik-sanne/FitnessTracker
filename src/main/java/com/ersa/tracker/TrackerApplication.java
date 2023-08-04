package com.ersa.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@SuppressWarnings({"checkstyle:HideUtilityClassConstructor", "checkstyle:FileTabCharacter"})
public class TrackerApplication {
	public static void main(final String[] args) {
		SpringApplication.run(TrackerApplication.class, args);
	}
}
