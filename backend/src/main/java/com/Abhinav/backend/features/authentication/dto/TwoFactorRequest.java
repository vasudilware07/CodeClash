package com.Abhinav.backend.features.authentication.dto;


import jakarta.validation.constraints.NotBlank;

public class TwoFactorRequest {
    @NotBlank(message = "Email cannot be blank")
    private String email;
    private String token;

    public TwoFactorRequest() {}

    public TwoFactorRequest(String email, String code) {
        this.email = email;
        this.token = code;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setToken(String token) {
        this.token = token;
    }
}