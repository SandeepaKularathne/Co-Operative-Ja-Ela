package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByCRDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CountByCRDateDao extends JpaRepository<CountByCRDate,Integer> {

    @Query("SELECT new CountByCRDate(YEAR(c.date), MONTH(c.date), g.name, COUNT(c)) FROM Customer c JOIN Gender g ON c.gender.id = g.id WHERE YEAR(c.date) = :year GROUP BY YEAR(c.date), MONTH(c.date), g.name ORDER BY YEAR(c.date), MONTH(c.date), g.name")
    List<CountByCRDate> countByCRDate(@Param("year") int year);


}

