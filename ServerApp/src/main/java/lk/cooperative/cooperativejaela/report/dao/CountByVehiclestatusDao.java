package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByVehiclestatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByVehiclestatusDao extends JpaRepository<CountByVehiclestatus,Integer> {

    @Query(value = "SELECT NEW CountByVehiclestatus(s.name, COUNT(v.number)) FROM Vehicle v, Vehiclestatus s WHERE v.vehiclestatus.id = s.id GROUP BY s.id")
    List<CountByVehiclestatus> countByVehiclestatus();

}

