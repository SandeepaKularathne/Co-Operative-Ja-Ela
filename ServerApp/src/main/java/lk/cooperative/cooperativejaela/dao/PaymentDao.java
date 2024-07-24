package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentDao extends JpaRepository<Payment,Integer> {

    Optional<Payment> findById(Integer id);
    Optional<Payment> findByPnumber(String number);

    @Query("select e from Payment e where e.id = :id")
    Payment findByMyId(@Param("id") Integer id);

    @Query("select e from Payment e where e.pnumber = :number")
    Payment findByMyNumber(@Param("number") String number);

}

