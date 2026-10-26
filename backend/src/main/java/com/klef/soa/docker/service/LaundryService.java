package com.klef.soa.docker.service;

import java.util.List;
import com.klef.soa.docker.dto.LaundryRequest;
import com.klef.soa.docker.entity.Laundry;

public interface LaundryService {
    Laundry addService(LaundryRequest request);
    List<Laundry> getAllServices();
    Laundry getServiceById(Long id);
    Laundry updateService(Long id, LaundryRequest request);
    void deleteService(Long id);
}
