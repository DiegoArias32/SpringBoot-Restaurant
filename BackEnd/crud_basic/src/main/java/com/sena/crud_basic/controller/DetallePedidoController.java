package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.DetallePedidoDTO;
import com.sena.crud_basic.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @PostMapping
    public ResponseEntity<String> crearDetallePedido(@RequestBody DetallePedidoDTO detalle) {
        String resultado = detallePedidoService.guardarDetallePedido(detalle);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<List<DetallePedidoDTO>> obtenerDetallesPorPedido(@PathVariable int idPedido) {
        return ResponseEntity.ok(detallePedidoService.obtenerDetallesPorPedido(idPedido));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedidoDTO> obtenerDetallePorId(@PathVariable int id) {
        DetallePedidoDTO detalle = detallePedidoService.obtenerDetallePorId(id);
        if (detalle != null) {
            return ResponseEntity.ok(detalle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarDetallePedido(@PathVariable int id, @RequestBody DetallePedidoDTO detalle) {
        detalle.setIdDetalle(id);
        String resultado = detallePedidoService.actualizarDetallePedido(detalle);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarDetallePedido(@PathVariable int id) {
        String resultado = detallePedidoService.eliminarDetallePedido(id);
        return ResponseEntity.ok(resultado);
    }
}