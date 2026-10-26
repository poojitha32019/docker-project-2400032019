package com.klef.soa.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendServiceImplementation {
    public static void main(String[] args) {
        SpringApplication.run(BackendServiceImplementation.class, args);
        System.out.println("Laundry service is running");
    }
}
