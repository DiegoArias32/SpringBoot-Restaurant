package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.ClientDTO;
import com.sena.crud_basic.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*") // Allow requests from any origin
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PostMapping
    public ResponseEntity<String> createClient(@RequestBody ClientDTO client) {
        String result = clientService.saveClient(client);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(@RequestParam String term) {
        return ResponseEntity.ok(clientService.searchClients(term));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getClientById(@PathVariable Long id) {  // Changed to Long
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateClient(
        @PathVariable Long id,  // Changed to Long
        @RequestBody ClientDTO client
    ) {
        String result = clientService.updateClient(id, client);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {  // Changed to Long
        String result = clientService.deleteClient(id);
        return ResponseEntity.ok(result);
    }
}
