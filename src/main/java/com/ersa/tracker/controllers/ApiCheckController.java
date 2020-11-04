package com.ersa.tracker.controllers;

import com.ersa.tracker.models.Pong;
import org.springframework.web.bind.annotation.*;

@RestController
public class ApiCheckController {

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/test/{id}", produces = "application/json")
    public Pong test(@PathVariable int id) {
        return new Pong("Pong", ++id);
    }
}
