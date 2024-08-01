package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GrnDao extends JpaRepository<Grn,Integer> {

    Optional<Grn> findById(Integer id);

    @Query("select e from Grn e where e.id = :id")
    Grn findByMyId(@Param("id") Integer id);

    @Query("SELECT i FROM Grnitem i, Grn g where g.id = :id and i.grn.id = g.id")
    List<Grnitem> findByGrnItemId(@Param("id") Integer id);

    @Query("select po from Grn po where po.grnnumber = :number")
    Grn findByGrnnumber(@Param("number")String number);

    @Query("SELECT g FROM Grn g WHERE g.id = :id")
    List<Grn> findtotal(@Param("id") Integer id);

}

