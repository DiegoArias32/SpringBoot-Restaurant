package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.EmpleadoDTO;
import com.sena.crud_basic.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @PostMapping
    public ResponseEntity<String> crearEmpleado(@RequestBody EmpleadoDTO empleado) {
        String resultado = empleadoService.guardarEmpleado(empleado);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping
    public ResponseEntity<List<EmpleadoDTO>> obtenerTodosEmpleados() {
        return ResponseEntity.ok(empleadoService.obtenerTodosEmpleados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> obtenerEmpleadoPorId(@PathVariable int id) {
        EmpleadoDTO empleado = empleadoService.obtenerEmpleadoPorId(id);
        if (empleado != null) {
            return ResponseEntity.ok(empleado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarEmpleado(@PathVariable int id, @RequestBody EmpleadoDTO empleado) {
        empleado.setIdEmpleado(id);
        String resultado = empleadoService.actualizarEmpleado(empleado);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarEmpleado(@PathVariable int id) {
        String resultado = empleadoService.eliminarEmpleado(id);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<EmpleadoDTO>> buscarEmpleados(@RequestParam String termino) {
        return ResponseEntity.ok(empleadoService.buscarEmpleados(termino));
    }
}