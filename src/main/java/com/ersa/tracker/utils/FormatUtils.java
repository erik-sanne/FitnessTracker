package com.ersa.tracker.utils;

public class FormatUtils {

    public static String exerciseName(String exercise) {
        exercise = exercise.replaceAll("_", " ");
        exercise = exercise.toLowerCase();
        return exercise;
    }
}
