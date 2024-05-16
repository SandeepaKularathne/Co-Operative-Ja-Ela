package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Vehicle;
import lk.cooperative.cooperativejaela.entity.Vehiclestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiclestatusDao extends JpaRepository<Vehiclestatus,Integer> {

    
}