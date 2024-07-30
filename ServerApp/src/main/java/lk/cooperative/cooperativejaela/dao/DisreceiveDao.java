package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Disreceive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DisreceiveDao extends JpaRepository<Disreceive,Integer> {
    
    Optional<Disreceive> findById(Integer id);

    Optional<Disreceive> findByDisrecnumber(String id);

    @Query("select e from Disreceive e where e.id = :id")
    Disreceive findByMyId(@Param("id") Integer id);

}

