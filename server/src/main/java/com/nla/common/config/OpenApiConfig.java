package com.nla.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("National Land Acquisition & Management System (NLAMS) API")
                        .description("Centralized REST APIs for digitizing the end-to-end land acquisition lifecycle in India across projects, proposals, land parcels, notifications, awards, compensations, possession, R&R, GIS, documents, and audit logs.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("NLAMS Architecture & Engineering Team")
                                .email("support@nlams.gov.in"))
                        .license(new License()
                                .name("Government of India / National Land Resources")
                                .url("https://dolr.gov.in")))
                .servers(List.of(
                        new Server().url("/").description("Default Server URL")
                ));
    }

    @Bean
    public com.fasterxml.jackson.databind.ObjectMapper objectMapper() {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
