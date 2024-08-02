package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Disstatus;
import lk.cooperative.cooperativejaela.entity.Vehiclestatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DisstatusDao extends JpaRepository<Disstatus,Integer> {

    @Query("SELECT p FROM Disstatus p WHERE p.name = :name")
    Disstatus findByName(@Param("name") String name);

}

