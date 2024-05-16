package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehicleDao extends JpaRepository<Vehicle,Integer> {

    
}