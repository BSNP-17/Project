package com.travelease.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private boolean success = true;
    private T data;
    private String message;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> success(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.message = message;
        return response;
    }
}
