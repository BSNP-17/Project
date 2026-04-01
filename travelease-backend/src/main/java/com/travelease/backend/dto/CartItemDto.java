package com.travelease.backend.dto;

import java.util.List;

public class CartItemDto {
    private String busId;
    private List<String> selectedSeats;
    private Double totalPrice;

    public String getBusId() { return busId; }
    public void setBusId(String busId) { this.busId = busId; }

    public List<String> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}