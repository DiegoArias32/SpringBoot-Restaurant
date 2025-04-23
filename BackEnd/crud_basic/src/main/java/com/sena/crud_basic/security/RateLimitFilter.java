package com.sena.crud_basic.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sena.crud_basic.security.services.RateLimitService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Obtener la dirección IP del cliente
        String ipAddress = getClientIP(request);
        
        // Intenta consumir un token del bucket para esta IP
        if (rateLimitService.tryConsume(ipAddress)) {
            // Si hay tokens disponibles, continuar
            filterChain.doFilter(request, response);
        } else {
            // Si no hay tokens, responder con 429 Too Many Requests
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
            responseBody.put("error", "Too Many Requests");
            responseBody.put("message", "Has excedido el límite de peticiones. Por favor, intenta más tarde.");
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getWriter(), responseBody);
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader != null && !xForwardedForHeader.isEmpty()) {
            // Si hay X-Forwarded-For, usar la primera IP (cliente original)
            return xForwardedForHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}