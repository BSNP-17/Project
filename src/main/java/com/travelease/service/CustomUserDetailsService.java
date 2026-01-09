package com.travelease.service;

import com.travelease.entity.User;
import com.travelease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;
import java.lang.reflect.Method;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(getAuthorities(user.getRoles()))
            .build();
    }

    private List<GrantedAuthority> getAuthorities(Collection<?> roles) {
        if (roles == null) return Collections.emptyList();

        return roles.stream()
            .filter(Objects::nonNull)
            .map(roleObj -> {
                String roleName = null;

                if (roleObj instanceof String) {
                    roleName = ((String) roleObj).trim();
                } else if (roleObj instanceof Enum<?>) {
                    roleName = ((Enum<?>) roleObj).name();
                } else {
                    try {
                        Method m = roleObj.getClass().getMethod("getName");
                        roleName = (String) m.invoke(roleObj);
                    } catch (Exception ignored1) {
                        try {
                            Method m = roleObj.getClass().getMethod("getRoleName");
                            roleName = (String) m.invoke(roleObj);
                        } catch (Exception ignored2) {
                            try {
                                Method m = roleObj.getClass().getMethod("getRole");
                                roleName = (String) m.invoke(roleObj);
                            } catch (Exception ignored3) {
                                // fallback to toString()
                                roleName = roleObj.toString();
                            }
                        }
                    }
                }

                if (roleName == null) return null;
                roleName = roleName.trim();
                if (roleName.isEmpty()) return null;

                String normalized = roleName.toUpperCase();
                if (!normalized.startsWith("ROLE_")) normalized = "ROLE_" + normalized;
                return new SimpleGrantedAuthority(normalized);
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
}
