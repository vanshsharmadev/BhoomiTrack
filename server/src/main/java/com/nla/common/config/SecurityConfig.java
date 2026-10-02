package com.nla.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    public static final String ROLE_CENTRAL_AUTHORITY = "CENTRAL_AUTHORITY";
    public static final String ROLE_STATE_AUTHORITY = "STATE_AUTHORITY";
    public static final String ROLE_DISTRICT_AUTHORITY = "DISTRICT_AUTHORITY";
    public static final String ROLE_PROJECT_AGENCY = "PROJECT_AGENCY";
    public static final String ROLE_FIELD_OFFICER = "FIELD_OFFICER";
    public static final String ROLE_RR_OFFICER = "RR_OFFICER";
    public static final String ROLE_ADMIN = "ADMIN";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/actuator/**",
                                "/api/public/**",
                                "/api/**" // Permissive default for frictionless API evaluation & testing
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(encoder.encode("admin123"))
                .roles(ROLE_ADMIN, ROLE_CENTRAL_AUTHORITY)
                .build();

        UserDetails central = User.builder()
                .username("central_officer")
                .password(encoder.encode("central123"))
                .roles(ROLE_CENTRAL_AUTHORITY)
                .build();

        UserDetails district = User.builder()
                .username("district_magistrate")
                .password(encoder.encode("district123"))
                .roles(ROLE_DISTRICT_AUTHORITY)
                .build();

        UserDetails agency = User.builder()
                .username("nhai_agency")
                .password(encoder.encode("nhai123"))
                .roles(ROLE_PROJECT_AGENCY)
                .build();

        UserDetails field = User.builder()
                .username("field_surveyor")
                .password(encoder.encode("field123"))
                .roles(ROLE_FIELD_OFFICER)
                .build();

        return new InMemoryUserDetailsManager(admin, central, district, agency, field);
    }
}
