package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Deposits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.Optional;

public interface DepositsDao extends JpaRepository<Deposits,Integer> {
    
    Optional<Deposits> findById(Integer id);
    Optional<Deposits>findByDate(Date date);

    @Query("select e from Deposits e where e.id = :id")
    Deposits findByMyId(@Param("id") Integer id);

}

