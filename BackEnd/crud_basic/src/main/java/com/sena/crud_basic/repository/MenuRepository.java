package com.sena.crud_basic.repository;

import com.sena.crud_basic.model.PlatoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<PlatoDTO, Integer> {
    
    // Método para buscar platos por nombre o descripción
    List<PlatoDTO> findByNombreContainingOrDescripcionContaining(String nombre, String descripcion);
}