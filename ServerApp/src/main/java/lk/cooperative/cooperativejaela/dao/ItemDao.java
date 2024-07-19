package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemDao extends JpaRepository<Item,Integer> {

    Optional<Item> findById(Integer id);
    @Query("select i from Item i where i.id = :id")
    Item findByMyId(@Param("id") Integer id);


    @Query("SELECT DISTINCT i FROM Item i " + "JOIN Poitem pi ON i.id = pi.item.id " + "WHERE pi.purorder.id = :id")
    List<Item> findItemByPurorder(@Param("id") Integer id);

}

