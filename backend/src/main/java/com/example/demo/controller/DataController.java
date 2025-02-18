package com.example.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET })
public class DataController {

    @GetMapping("/getClienteData")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public String getClienteData(@RequestHeader("Authorization") String authHeader) {
        String url = "http://122.8.186.221:7582/clientes/spsClientesFM/TIJ-0000001/268";

        // Obtener el token JWT desde el encabezado Authorization
        String token = authHeader.replace("Bearer ", "");
        
        // Realizar una solicitud HTTP al endpoint externo
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Hacer la solicitud GET
        ResponseEntity<String> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);

        // Devolver la respuesta externa
        return response.getBody();
    }
}
