package com.ersa.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalRecordDto {
    private String exercise;
    private Float weight;
    private Date date;
}
