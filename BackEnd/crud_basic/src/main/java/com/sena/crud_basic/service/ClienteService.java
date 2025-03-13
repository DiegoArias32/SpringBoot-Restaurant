package com.sena.crud_basic.service;

import com.sena.crud_basic.model.ClienteDTO;
import com.sena.crud_basic.repository.clienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private clienteRepository clienteRepository;

    public String guardarCliente(ClienteDTO cliente) {
        clienteRepository.save(cliente);
        return "Registro correcto";
    }

    public List<ClienteDTO> obtenerTodosClientes() {
        return clienteRepository.findAll();
    }

    public Optional<ClienteDTO> obtenerClientePorId(int id) {
        return clienteRepository.findById(id);
    }

    public String actualizarCliente(int id, ClienteDTO cliente) {
        if (clienteRepository.existsById(id)) {
            cliente.setIdCliente((long) id);
            clienteRepository.save(cliente);
            return "Cliente actualizado correctamente";
        }
        return "Cliente no encontrado";
    }

    public String eliminarCliente(int id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return "Cliente eliminado correctamente";
        }
        return "Cliente no encontrado";
    }

    public List<ClienteDTO> buscarClientes(String searchTerm) {
        return clienteRepository.searchClientes(searchTerm);
    }
}