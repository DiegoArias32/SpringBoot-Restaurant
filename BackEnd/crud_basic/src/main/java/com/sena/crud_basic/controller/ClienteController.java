package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.ClienteDTO;
import com.sena.crud_basic.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<String> crearCliente(@RequestBody ClienteDTO cliente) {
        String resultado = clienteService.guardarCliente(cliente);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> obtenerTodosClientes() {
        return ResponseEntity.ok(clienteService.obtenerTodosClientes());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteDTO>> buscarClientes(@RequestParam String termino) {
        return ResponseEntity.ok(clienteService.buscarClientes(termino));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> obtenerClientePorId(@PathVariable int id) {
        return ResponseEntity.ok(clienteService.obtenerClientePorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarCliente(
        @PathVariable int id, 
        @RequestBody ClienteDTO cliente
    ) {
        String resultado = clienteService.actualizarCliente(id, cliente);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCliente(@PathVariable int id) {
        String resultado = clienteService.eliminarCliente(id);
        return ResponseEntity.ok(resultado);
    }
}