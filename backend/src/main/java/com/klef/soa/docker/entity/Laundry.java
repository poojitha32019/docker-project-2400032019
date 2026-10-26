package com.klef.soa.docker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "laundry_services")
public class Laundry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String serviceName;

    @Column(nullable = false)
    private Boolean pickupAvailable;

    @Column(nullable = false)
    private Double pricePerKg;

    @Column(nullable = false)
    private Integer deliveryDays;

    public Laundry() { }
    public Laundry(Long id, String serviceName, Boolean pickupAvailable, Double pricePerKg, Integer deliveryDays) {
        this.id = id; this.serviceName = serviceName; this.pickupAvailable = pickupAvailable;
        this.pricePerKg = pricePerKg; this.deliveryDays = deliveryDays;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public Boolean getPickupAvailable() { return pickupAvailable; }
    public void setPickupAvailable(Boolean pickupAvailable) { this.pickupAvailable = pickupAvailable; }
    public Double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(Double pricePerKg) { this.pricePerKg = pricePerKg; }
    public Integer getDeliveryDays() { return deliveryDays; }
    public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }
}
