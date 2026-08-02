package com.ersa.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDto {
    private long id;
    private Date date;
    private List<WorkoutSetDto> sets;
}
