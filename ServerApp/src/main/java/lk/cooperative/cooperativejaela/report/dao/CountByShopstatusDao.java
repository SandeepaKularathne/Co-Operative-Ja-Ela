package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByShopstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByShopstatusDao extends JpaRepository<CountByShopstatus,Integer> {

    @Query(value = "SELECT NEW CountByShopstatus(s.name, COUNT(v.shopnumber)) FROM Shop v, Shopstatus s WHERE v.shopstatus.id = s.id GROUP BY s.id")
    List<CountByShopstatus> countByShopstatus();

}

