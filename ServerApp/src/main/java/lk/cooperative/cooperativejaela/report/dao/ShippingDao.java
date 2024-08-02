package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByVehiclestatus;
import lk.cooperative.cooperativejaela.report.entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShippingDao extends JpaRepository<Shipping,Integer> {

    @Query(value = "SELECT NEW Shipping(s.shopnumber , r.name, r.routenumber) FROM Shop s, Route r WHERE r.id= :id and r.id=s.route.id")
    List<Shipping> shipping(@Param("id") int id);

}

