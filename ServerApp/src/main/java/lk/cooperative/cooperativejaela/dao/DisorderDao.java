package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Disorder;
import lk.cooperative.cooperativejaela.entity.Disrequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DisorderDao extends JpaRepository<Disorder,Integer> {
    
    Optional<Disorder> findById(Integer id);

    Optional<Disorder> findByDisonumber(String id);

    @Query("select e from Disorder e where e.id = :id")
    Disorder findByMyId(@Param("id") Integer id);

    @Query("select po from Disorder po where po.disonumber = :number")
    Disorder findByNumber(@Param("number")String number);

}

