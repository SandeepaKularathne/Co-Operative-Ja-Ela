package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Grn;
import lk.cooperative.cooperativejaela.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvoiceDao extends JpaRepository<Invoice,Integer> {

    Optional<Invoice> findById(Integer id);

    @Query("select e from Invoice e where e.id = :id")
    Invoice findByMyId(@Param("id") Integer id);

    @Query("select e from Invoice e where e.invnumber = :number")
    Invoice findByMyNumber(@Param("number") String number);

}

