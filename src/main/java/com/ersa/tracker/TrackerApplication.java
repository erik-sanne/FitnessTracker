package com.ersa.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@SuppressWarnings({"checkstyle:HideUtilityClassConstructor", "checkstyle:FileTabCharacter"})
public class TrackerApplication {
	public static void main(final String[] args) {
		SpringApplication.run(TrackerApplication.class, args);
	}
}
