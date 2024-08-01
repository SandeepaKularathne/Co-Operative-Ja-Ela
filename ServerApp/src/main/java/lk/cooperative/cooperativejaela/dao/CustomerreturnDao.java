package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Critem;
import lk.cooperative.cooperativejaela.entity.Customerreturn;
import lk.cooperative.cooperativejaela.entity.Grnitem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerreturnDao extends JpaRepository<Customerreturn,Integer> {
    
    Optional<Customerreturn> findById(Integer id);

    @Query("select e from Customerreturn e where e.id = :id")
    Customerreturn findByMyId(@Param("id") Integer id);

    @Query("SELECT i FROM Critem i, Customerreturn g where g.id = :id and i.customerreturn.id = g.id")
    List<Critem> findByCrItemId(@Param("id") Integer id);

}

