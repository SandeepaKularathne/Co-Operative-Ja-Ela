package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShopDao extends JpaRepository<Shop,Integer> {
    
    Optional<Shop> findById(Integer id);

    Optional<Shop> findByShopnumber(String id);

    @Query("select e from Shop e where e.id = :id")
    Shop findByMyId(@Param("id") Integer id);

}

