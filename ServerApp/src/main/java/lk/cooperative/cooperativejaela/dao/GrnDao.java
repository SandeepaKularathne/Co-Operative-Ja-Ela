package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.entity.Grn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GrnDao extends JpaRepository<Grn,Integer> {

    Optional<Grn> findById(Integer id);

    @Query("select e from Grn e where e.id = :id")
    Grn findByMyId(@Param("id") Integer id);

}

