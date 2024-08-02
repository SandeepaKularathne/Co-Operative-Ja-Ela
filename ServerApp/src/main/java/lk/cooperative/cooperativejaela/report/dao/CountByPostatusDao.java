package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByPostatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByPostatusDao extends JpaRepository<CountByPostatus,Integer> {

    @Query(value = "SELECT NEW CountByPostatus(s.name, COUNT(v.ponumber)) FROM Purorder v, Postatus s WHERE v.postatus.id = s.id GROUP BY s.id")
    List<CountByPostatus> countByPostatus();

}

