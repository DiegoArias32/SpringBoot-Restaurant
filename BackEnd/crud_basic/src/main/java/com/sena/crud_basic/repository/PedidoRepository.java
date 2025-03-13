package com.sena.crud_basic.repository;

import com.sena.crud_basic.model.PedidoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoDTO, Integer> {
    
    // Método para buscar pedidos por cliente
    List<PedidoDTO> findByIdCliente(Integer idCliente);
    
    // Método para buscar pedidos por estado
    List<PedidoDTO> findByEstado(String estado);
    
    // Método para buscar pedidos por cliente y estado
    List<PedidoDTO> findByIdClienteAndEstado(Integer idCliente, String estado);
}