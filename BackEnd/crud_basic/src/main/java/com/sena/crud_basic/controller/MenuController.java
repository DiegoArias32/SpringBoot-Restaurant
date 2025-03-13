package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.PlatoDTO;
import com.sena.crud_basic.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class MenuController {

    @Autowired
    private MenuService menuService;

    @PostMapping
    public ResponseEntity<String> crearPlato(@RequestBody PlatoDTO plato) {
        String resultado = menuService.guardarPlato(plato);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping
    public ResponseEntity<List<PlatoDTO>> obtenerTodosPlatos() {
        return ResponseEntity.ok(menuService.obtenerTodosPlatos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoDTO> obtenerPlatoPorId(@PathVariable int id) {
        PlatoDTO plato = menuService.obtenerPlatoPorId(id);
        if (plato != null) {
            return ResponseEntity.ok(plato);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarPlato(@PathVariable int id, @RequestBody PlatoDTO plato) {
        plato.setIdPlato(id);
        String resultado = menuService.actualizarPlato(plato);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarPlato(@PathVariable int id) {
        String resultado = menuService.eliminarPlato(id);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PlatoDTO>> buscarPlatos(@RequestParam String termino) {
        return ResponseEntity.ok(menuService.buscarPlatos(termino));
    }
}