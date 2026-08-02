package com.ersa.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDto {
    private String name;
    private List<Target> primaryTargets;
    private List<Target> secondaryTargets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Target {
        private String name;
        private List<String> splitAssociation;
    }
}
