package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CountByItemDao extends JpaRepository<CountByItem,Integer> {

    @Query(value = "SELECT NEW CountByItem(i.name , count(i.name)) FROM Item i, Poitem po, Purorder p WHERE i.id =po.item.id and po.purorder.id = p.id and p.supplier.id= :id GROUP BY i.name")
    List<CountByItem> countByItem(@Param("id") int id);

}

