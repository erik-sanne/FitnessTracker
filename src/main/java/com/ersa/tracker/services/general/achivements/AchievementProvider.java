package com.ersa.tracker.services.general.achivements;

import com.ersa.tracker.dto.Achievement;
import com.ersa.tracker.models.authentication.User;

public interface AchievementProvider {
    String getName();
    String getDescription();
    String getType();
    Achievement getAchievement(User user);

    enum Type {
        WORKOUT_COUNT("Dedication to the Cause"), SETS_AND_EXERCISES("Sets & Exercises"), FREQUENCY("Frequency & Consistency"), MISC("Miscellaneous");

        final private String value;
        Type(String text) {
            this.value = text;
        }

        @Override
        public String toString() {
            return value;
        }
    }
}
