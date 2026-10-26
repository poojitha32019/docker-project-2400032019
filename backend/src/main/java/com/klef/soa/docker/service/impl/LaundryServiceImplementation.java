package com.klef.soa.docker.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import com.klef.soa.docker.dto.LaundryRequest;
import com.klef.soa.docker.entity.Laundry;
import com.klef.soa.docker.repository.LaundryRepository;
import com.klef.soa.docker.service.LaundryService;

@Service
public class LaundryServiceImplementation implements LaundryService {
    private final LaundryRepository repository;
    public LaundryServiceImplementation(LaundryRepository repository) { this.repository = repository; }

    @Override public Laundry addService(LaundryRequest request) {
        Laundry service = new Laundry();
        copyRequest(request, service);
        return repository.save(service);
    }
    @Override public List<Laundry> getAllServices() { return repository.findAll(); }
    @Override public Laundry getServiceById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Laundry not found with id: " + id));
    }
    @Override public Laundry updateService(Long id, LaundryRequest request) {
        Laundry service = getServiceById(id);
        copyRequest(request, service);
        return repository.save(service);
    }
    @Override public void deleteService(Long id) { repository.delete(getServiceById(id)); }
    private void copyRequest(LaundryRequest request, Laundry service) {
        service.setServiceName(request.getServiceName().trim());
        service.setPickupAvailable(request.getPickupAvailable());
        service.setPricePerKg(request.getPricePerKg());
        service.setDeliveryDays(request.getDeliveryDays());
    }
}
