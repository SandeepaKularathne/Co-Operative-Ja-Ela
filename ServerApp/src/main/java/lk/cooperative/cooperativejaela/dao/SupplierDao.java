package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    Supplier findByRegisternumber(String registernumber);
    
    Optional<Supplier> findById(Integer id);

    @Query("select s from Supplier s where s.id = :id")
    Supplier findByMyId(@Param("id") Integer id);

    @Query("SELECT DISTINCT s FROM Grn g " + "JOIN Purorder po ON po.id = g.purorder.id " + "JOIN Supplier s ON po.supplier.id = s.id " + "WHERE g.id = :id")
    List<Supplier> findItemByGrn(@Param("id") Integer id);

}

