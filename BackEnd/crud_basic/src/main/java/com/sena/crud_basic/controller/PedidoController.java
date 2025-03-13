package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.PedidoDTO;
import com.sena.crud_basic.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<String> crearPedido(@RequestBody PedidoDTO pedido) {
        String resultado = pedidoService.guardarPedido(pedido);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> obtenerTodosPedidos() {
        return ResponseEntity.ok(pedidoService.obtenerTodosPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obtenerPedidoPorId(@PathVariable int id) {
        PedidoDTO pedido = pedidoService.obtenerPedidoPorId(id);
        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<PedidoDTO>> obtenerPedidosPorCliente(@PathVariable int idCliente) {
        return ResponseEntity.ok(pedidoService.obtenerPedidosPorCliente(idCliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarPedido(@PathVariable int id, @RequestBody PedidoDTO pedido) {
        pedido.setIdPedido(id);
        String resultado = pedidoService.actualizarPedido(pedido);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<String> actualizarEstadoPedido(@PathVariable int id, @RequestParam String estado) {
        String resultado = pedidoService.actualizarEstadoPedido(id, estado);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarPedido(@PathVariable int id) {
        String resultado = pedidoService.eliminarPedido(id);
        return ResponseEntity.ok(resultado);
    }
}