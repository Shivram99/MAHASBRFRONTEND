package com.mahasbr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SbrBackEndProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(SbrBackEndProjectApplication.class, args);
	}
	
	    @Bean
	    public WebMvcConfigurer corsConfigurer() {
	        return new WebMvcConfigurer() {
	            @Override
	            public void addCorsMappings(CorsRegistry registry) {
	                registry.addMapping("/**")
	                        //.allowedOrigins("http://localhost:4200") // Assuming Angular app runs on localhost:4200
	                        .allowedOrigins("*") // Assuming Angular app runs on localhost:4200
	                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Add allowed methods as needed
	                        .allowedHeaders("*")
	                        .allowCredentials(false)
	                        .exposedHeaders("Access-Control-Allow-Origin"); // Add exposed headers as needed
	            }
	        };
	    }

	
	
	@Profile("local")
    @Bean
    public String devBean() {
        return "local";
    }

    @Profile("uat")
    @Bean
    public String qaBean() {
        return "uat";
    }

    @Profile("prod")
    @Bean
    public String prodBean() {
        return "prod";
    }
}
