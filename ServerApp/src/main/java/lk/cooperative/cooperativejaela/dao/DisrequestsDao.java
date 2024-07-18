package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Disrequests;
import lk.cooperative.cooperativejaela.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DisrequestsDao extends JpaRepository<Disrequests,Integer> {
    
    Optional<Disrequests> findById(Integer id);

    Optional<Disrequests> findByDisnumber(String id);

    @Query("select e from Disrequests e where e.id = :id")
    Disrequests findByMyId(@Param("id") Integer id);

}

