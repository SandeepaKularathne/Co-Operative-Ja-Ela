package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Supayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SupaymentDao extends JpaRepository<Supayment,Integer> {

    Optional<Supayment> findById(Integer id);

    @Query("select e from Supayment e where e.id = :id")
    Supayment findByMyId(@Param("id") Integer id);

}

