package com.ersa.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDto {
    private long id;
    private String fromDisplayName;
    private String toDisplayName;
}
