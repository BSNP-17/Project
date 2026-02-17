package com.travelease.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalUsers;
    private long totalBuses;
    private long totalBookings;
    private double totalRevenue;
}