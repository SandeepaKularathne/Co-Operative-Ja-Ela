package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerDao extends JpaRepository<Customer,Integer> {

    Customer findByPhonenumber(String number);
    Optional<Customer> findById(Integer id);

    @Query("select e from Customer e where e.id = :id")
    Customer findByMyId(@Param("id") Integer id);


}

