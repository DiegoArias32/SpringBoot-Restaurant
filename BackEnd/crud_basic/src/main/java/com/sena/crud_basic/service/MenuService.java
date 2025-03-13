package com.sena.crud_basic.service;

import com.sena.crud_basic.model.PlatoDTO;
import com.sena.crud_basic.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    public String guardarPlato(PlatoDTO plato) {
        try {
            menuRepository.save(plato);
            return "Plato guardado correctamente";
        } catch (Exception e) {
            return "Error al guardar el plato: " + e.getMessage();
        }
    }

    public List<PlatoDTO> obtenerTodosPlatos() {
        return menuRepository.findAll();
    }

    public PlatoDTO obtenerPlatoPorId(int id) {
        Optional<PlatoDTO> plato = menuRepository.findById(id);
        return plato.orElse(null);
    }

    public String actualizarPlato(PlatoDTO plato) {
        if (menuRepository.existsById(plato.getIdPlato())) {
            try {
                menuRepository.save(plato);
                return "Plato actualizado correctamente";
            } catch (Exception e) {
                return "Error al actualizar el plato: " + e.getMessage();
            }
        } else {
            return "No se encontró el plato con ID: " + plato.getIdPlato();
        }
    }

    public String eliminarPlato(int id) {
        if (menuRepository.existsById(id)) {
            try {
                menuRepository.deleteById(id);
                return "Plato eliminado correctamente";
            } catch (Exception e) {
                return "Error al eliminar el plato: " + e.getMessage();
            }
        } else {
            return "No se encontró el plato con ID: " + id;
        }
    }

    public List<PlatoDTO> buscarPlatos(String termino) {
        return menuRepository.findByNombreContainingOrDescripcionContaining(termino, termino);
    }
}