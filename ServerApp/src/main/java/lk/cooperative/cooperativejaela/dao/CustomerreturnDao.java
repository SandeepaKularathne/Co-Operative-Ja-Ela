package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Customerreturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerreturnDao extends JpaRepository<Customerreturn,Integer> {
    
    Optional<Customerreturn> findById(Integer id);

    @Query("select e from Customerreturn e where e.id = :id")
    Customerreturn findByMyId(@Param("id") Integer id);

}

