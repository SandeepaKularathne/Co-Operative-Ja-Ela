package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Storereturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StorereturnDao extends JpaRepository<Storereturn,Integer> {
    
    Optional<Storereturn> findById(Integer id);

    @Query("select e from Storereturn e where e.id = :id")
    Storereturn findByMyId(@Param("id") Integer id);

}

