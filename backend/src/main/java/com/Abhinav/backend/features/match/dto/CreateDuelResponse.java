package com.Abhinav.backend.features.match.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDuelResponse {
    private UUID matchId;
    private String roomCode;
    private String shareableLink;
}