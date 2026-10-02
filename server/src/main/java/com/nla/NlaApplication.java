package com.nla;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class NlaApplication {

    public static void main(String[] args) {
        SpringApplication.run(NlaApplication.class, args);
    }
}
