package com.sena.crud_basic.service;

import com.sena.crud_basic.model.PedidoDTO;
import com.sena.crud_basic.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public String guardarPedido(PedidoDTO pedido) {
        try {
            pedidoRepository.save(pedido);
            return "Pedido guardado correctamente";
        } catch (Exception e) {
            return "Error al guardar el pedido: " + e.getMessage();
        }
    }

    public List<PedidoDTO> obtenerTodosPedidos() {
        return pedidoRepository.findAll();
    }

    public PedidoDTO obtenerPedidoPorId(int id) {
        Optional<PedidoDTO> pedido = pedidoRepository.findById(id);
        return pedido.orElse(null);
    }

    public List<PedidoDTO> obtenerPedidosPorCliente(int idCliente) {
        return pedidoRepository.findByIdCliente(idCliente);
    }

    public String actualizarPedido(PedidoDTO pedido) {
        if (pedidoRepository.existsById(pedido.getIdPedido())) {
            try {
                pedidoRepository.save(pedido);
                return "Pedido actualizado correctamente";
            } catch (Exception e) {
                return "Error al actualizar el pedido: " + e.getMessage();
            }
        } else {
            return "No se encontró el pedido con ID: " + pedido.getIdPedido();
        }
    }

    public String actualizarEstadoPedido(int id, String estado) {
        Optional<PedidoDTO> optionalPedido = pedidoRepository.findById(id);
        
        if (optionalPedido.isPresent()) {
            try {
                PedidoDTO pedido = optionalPedido.get();
                pedido.setEstado(estado);
                pedidoRepository.save(pedido);
                return "Estado del pedido actualizado correctamente";
            } catch (Exception e) {
                return "Error al actualizar el estado del pedido: " + e.getMessage();
            }
        } else {
            return "No se encontró el pedido con ID: " + id;
        }
    }

    public String eliminarPedido(int id) {
        if (pedidoRepository.existsById(id)) {
            try {
                pedidoRepository.deleteById(id);
                return "Pedido eliminado correctamente";
            } catch (Exception e) {
                return "Error al eliminar el pedido: " + e.getMessage();
            }
        } else {
            return "No se encontró el pedido con ID: " + id;
        }
    }
}