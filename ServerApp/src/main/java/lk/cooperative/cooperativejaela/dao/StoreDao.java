package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StoreDao extends JpaRepository<Store,Integer> {
    
    Optional<Store> findById(Integer id);

    Optional<Store> findByStorenumber(String id);

    @Query("select e from Store e where e.id = :id")
    Store findByMyId(@Param("id") Integer id);

}

