package com.sena.crud_basic.service;

import com.sena.crud_basic.model.EmpleadoDTO;
import com.sena.crud_basic.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public String guardarEmpleado(EmpleadoDTO empleado) {
        try {
            empleadoRepository.save(empleado);
            return "Empleado guardado correctamente";
        } catch (Exception e) {
            return "Error al guardar el empleado: " + e.getMessage();
        }
    }

    public List<EmpleadoDTO> obtenerTodosEmpleados() {
        return empleadoRepository.findAll();
    }

    public EmpleadoDTO obtenerEmpleadoPorId(int id) {
        Optional<EmpleadoDTO> empleado = empleadoRepository.findById(id);
        return empleado.orElse(null);
    }

    public String actualizarEmpleado(EmpleadoDTO empleado) {
        if (empleadoRepository.existsById(empleado.getIdEmpleado())) {
            try {
                empleadoRepository.save(empleado);
                return "Empleado actualizado correctamente";
            } catch (Exception e) {
                return "Error al actualizar el empleado: " + e.getMessage();
            }
        } else {
            return "No se encontró el empleado con ID: " + empleado.getIdEmpleado();
        }
    }

    public String eliminarEmpleado(int id) {
        if (empleadoRepository.existsById(id)) {
            try {
                empleadoRepository.deleteById(id);
                return "Empleado eliminado correctamente";
            } catch (Exception e) {
                return "Error al eliminar el empleado: " + e.getMessage();
            }
        } else {
            return "No se encontró el empleado con ID: " + id;
        }
    }

    public List<EmpleadoDTO> buscarEmpleados(String termino) {
        return empleadoRepository.findByNombreContainingOrApellidoContainingOrPuestoContaining(
                termino, termino, termino);
    }
}