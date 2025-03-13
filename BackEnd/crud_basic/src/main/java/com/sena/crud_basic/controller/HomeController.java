package com.sena.crud_basic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/restaurant")
    public String home() {
        return "welcome"; // Este es el nombre del archivo HTML sin la extensión
    }
}
