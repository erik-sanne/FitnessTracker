package com.ersa.tracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@SuppressWarnings({"checkstyle:HideUtilityClassConstructor", "checkstyle:FileTabCharacter"})
class TrackerApplicationTests {

	static {
		System.setProperty("CLIENT_ORIGIN", "http://localhost:3000");
	}

	@Test
	void contextLoads() {
	}

}
