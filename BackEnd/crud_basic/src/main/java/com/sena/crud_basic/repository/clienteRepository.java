package com.sena.crud_basic.repository;

import com.sena.crud_basic.model.ClienteDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface clienteRepository extends JpaRepository<ClienteDTO, Integer> {  // Change to Integer
    // Custom query method to search clients by name, lastname, or email
    @Query("SELECT c FROM cliente c WHERE " +
           "LOWER(c.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.apellido) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<ClienteDTO> searchClientes(@Param("searchTerm") String searchTerm);
}