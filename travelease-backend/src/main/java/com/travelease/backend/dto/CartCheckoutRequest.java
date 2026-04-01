package com.travelease.backend.dto;

import java.util.List;

public class CartCheckoutRequest {
    private String userId;
    private List<CartItemDto> cartItems;
    private String paymentMethod; // e.g., "UPI", "CARD"

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<CartItemDto> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItemDto> cartItems) { this.cartItems = cartItems; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}