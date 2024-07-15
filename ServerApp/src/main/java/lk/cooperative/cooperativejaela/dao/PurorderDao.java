package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Purorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PurorderDao extends JpaRepository<Purorder,Integer> {

    Optional<Purorder> findById(Integer id);
    @Query("select i from Purorder i where i.id = :id")
    Purorder findByMyId(@Param("id") Integer id);

}

