package com.travelease.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    @NotBlank 
    private String username;
    @Email private String email;
    @NotBlank private String password;  // BCrypt hashed
  //  private String role="USER";     // USER/ADMIN/OPERATOR
    //private String phone;
    private List<String> roles=new ArrayList<>();

    public void addDefaultRole() {
        if (this.roles.isEmpty()) {
            this.roles.add("USER");
        }
    }
}


