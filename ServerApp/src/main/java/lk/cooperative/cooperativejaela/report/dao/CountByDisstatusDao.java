package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByDisstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByDisstatusDao extends JpaRepository<CountByDisstatus,Integer> {

    @Query(value = "SELECT NEW CountByDisstatus(s.name, COUNT(v.disnumber)) FROM Disrequests v, Disstatus s WHERE v.disstatus.id = s.id GROUP BY s.id")
    List<CountByDisstatus> countByDisstatus();

}

