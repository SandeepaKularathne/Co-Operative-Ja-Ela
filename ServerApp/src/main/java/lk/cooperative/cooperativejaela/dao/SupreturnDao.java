package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Grn;
import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Supreturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SupreturnDao extends JpaRepository<Supreturn,Integer> {

    Optional<Supreturn> findById(Integer id);

    @Query("select e from Supreturn e where e.id = :id")
    Supreturn findByMyId(@Param("id") Integer id);

    @Query("SELECT s FROM Grn g,Supreturn s WHERE g.id = :id and s.grn.id=g.id ")
    List<Supreturn> findtotal(@Param("id") Integer id);

}

