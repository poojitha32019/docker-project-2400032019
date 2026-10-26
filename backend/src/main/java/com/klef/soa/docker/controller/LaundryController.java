package com.klef.soa.docker.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.klef.soa.docker.dto.LaundryRequest;
import com.klef.soa.docker.entity.Laundry;
import com.klef.soa.docker.service.LaundryService;
import jakarta.validation.Valid;

@RestController
@Validated
@RequestMapping("/api/laundry-services")
@CrossOrigin(origins = "*")
public class LaundryController {
    @Autowired
    private LaundryService service;

    @PostMapping("/add")
    public ResponseEntity<Laundry> addService(@Valid @RequestBody LaundryRequest request) {
        return new ResponseEntity<>(service.addService(request), HttpStatus.CREATED);
    }
    @GetMapping("/displayall")
    public ResponseEntity<List<Laundry>> getAllServices() { return ResponseEntity.ok(service.getAllServices()); }
    @GetMapping("/display/{id}")
    public ResponseEntity<Laundry> getServiceById(@PathVariable Long id) { return ResponseEntity.ok(service.getServiceById(id)); }
    @PutMapping("/update/{id}")
    public ResponseEntity<Laundry> updateService(@PathVariable Long id, @Valid @RequestBody LaundryRequest request) {
        return ResponseEntity.ok(service.updateService(id, request));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Long id) {
        service.deleteService(id);
        return ResponseEntity.ok("Laundry deleted successfully.");
    }
}
