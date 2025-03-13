package com.sena.crud_basic.repository;

import com.sena.crud_basic.model.DetallePedidoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedidoDTO, Integer> {
    
    // Método para buscar detalles por pedido
    List<DetallePedidoDTO> findByIdPedido(Integer idPedido);
    
    // Método para buscar detalles por plato
    List<DetallePedidoDTO> findByIdPlato(Integer idPlato);
    
    // Método para buscar detalles por pedido y plato
    DetallePedidoDTO findByIdPedidoAndIdPlato(Integer idPedido, Integer idPlato);
}