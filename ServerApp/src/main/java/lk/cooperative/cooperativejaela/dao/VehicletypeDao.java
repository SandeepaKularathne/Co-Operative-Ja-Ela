package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Vehicle;
import lk.cooperative.cooperativejaela.entity.Vehicletype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicletypeDao extends JpaRepository<Vehicletype,Integer> {

    
}