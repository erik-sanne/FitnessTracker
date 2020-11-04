package com.ersa.tracker.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
public class ApiCheckController {

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/test/{id}", produces = "application/json")
    public String test(@PathVariable int id) {
        return String.format("pong %d", ++id);
    }
}
