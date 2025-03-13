package com.sena.crud_basic.repository;

import com.sena.crud_basic.model.EmpleadoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpleadoRepository extends JpaRepository<EmpleadoDTO, Integer> {
    
    // Método para buscar empleados por nombre, apellido o puesto
    List<EmpleadoDTO> findByNombreContainingOrApellidoContainingOrPuestoContaining(
            String nombre, String apellido, String puesto);
}