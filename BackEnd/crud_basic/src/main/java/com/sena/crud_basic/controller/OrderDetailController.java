package com.sena.crud_basic.controller;

import com.sena.crud_basic.model.OrderDetailDTO;
import com.sena.crud_basic.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "*") // Allow requests from any origin
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @PostMapping
    public ResponseEntity<String> createOrderDetail(@RequestBody OrderDetailDTO orderDetail) {
        String result = orderDetailService.saveOrderDetail(orderDetail);
        return ResponseEntity.ok(result);
    }

    // Corrected the method name here
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getDetailsByOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailsByOrderId(orderId)); // Corrected method name
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable int id) {
        OrderDetailDTO orderDetail = orderDetailService.getOrderDetailById(id);
        if (orderDetail != null) {
            return ResponseEntity.ok(orderDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateOrderDetail(@PathVariable int id, @RequestBody OrderDetailDTO orderDetail) {
        orderDetail.setIdDetail(id);
        String result = orderDetailService.updateOrderDetail(orderDetail);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderDetail(@PathVariable int id) {
        String result = orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.ok(result);
    }
}
