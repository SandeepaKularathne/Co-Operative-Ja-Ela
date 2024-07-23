package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByVehiclestatus;
import lk.cooperative.cooperativejaela.report.entity.DashRep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DashRepDao extends JpaRepository<DashRep, Integer> {

    @Query("SELECT NEW DashRep(SUM(CASE WHEN i.quantity < i.rop THEN 1 ELSE 0 END) * 100.0 / COUNT(i), SUM(CASE WHEN i.quantity >= i.rop THEN 1 ELSE 0 END) * 100.0 / COUNT(i)) FROM Item i")
    List<DashRep> dashrep();
}


