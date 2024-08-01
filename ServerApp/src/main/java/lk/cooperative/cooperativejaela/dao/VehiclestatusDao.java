package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Postatus;
import lk.cooperative.cooperativejaela.entity.Vehicle;
import lk.cooperative.cooperativejaela.entity.Vehiclestatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehiclestatusDao extends JpaRepository<Vehiclestatus,Integer> {

    @Query("SELECT p FROM Vehiclestatus p WHERE p.name = :name")
    Vehiclestatus findByName(@Param("name") String name);
    
}