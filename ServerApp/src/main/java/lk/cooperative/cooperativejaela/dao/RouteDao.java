package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RouteDao extends JpaRepository<Route,Integer> {
    
    Optional<Route> findById(Integer id);

    Optional<Route> findByRoutenumber(String id);

    @Query("select e from Route e where e.id = :id")
    Route findByMyId(@Param("id") Integer id);

}

