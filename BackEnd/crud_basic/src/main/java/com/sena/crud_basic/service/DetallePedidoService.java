package com.sena.crud_basic.service;

import com.sena.crud_basic.model.DetallePedidoDTO;
import com.sena.crud_basic.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public String guardarDetallePedido(DetallePedidoDTO detalle) {
        try {
            detallePedidoRepository.save(detalle);
            return "Detalle de pedido guardado correctamente";
        } catch (Exception e) {
            return "Error al guardar el detalle de pedido: " + e.getMessage();
        }
    }

    public List<DetallePedidoDTO> obtenerDetallesPorPedido(int idPedido) {
        return detallePedidoRepository.findByIdPedido(idPedido);
    }

    public DetallePedidoDTO obtenerDetallePorId(int id) {
        Optional<DetallePedidoDTO> detalle = detallePedidoRepository.findById(id);
        return detalle.orElse(null);
    }

    public String actualizarDetallePedido(DetallePedidoDTO detalle) {
        if (detallePedidoRepository.existsById(detalle.getIdDetalle())) {
            try {
                detallePedidoRepository.save(detalle);
                return "Detalle de pedido actualizado correctamente";
            } catch (Exception e) {
                return "Error al actualizar el detalle de pedido: " + e.getMessage();
            }
        } else {
            return "No se encontró el detalle de pedido con ID: " + detalle.getIdDetalle();
        }
    }

    public String eliminarDetallePedido(int id) {
        if (detallePedidoRepository.existsById(id)) {
            try {
                detallePedidoRepository.deleteById(id);
                return "Detalle de pedido eliminado correctamente";
            } catch (Exception e) {
                return "Error al eliminar el detalle de pedido: " + e.getMessage();
            }
        } else {
            return "No se encontró el detalle de pedido con ID: " + id;
        }
    }
}