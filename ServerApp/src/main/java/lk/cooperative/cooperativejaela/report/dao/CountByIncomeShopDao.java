package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByIncomeShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CountByIncomeShopDao extends JpaRepository<CountByIncomeShop, Integer> {

    @Query("SELECT new CountByIncomeShop(YEAR(d.date), MONTH(d.date), s.shopnumber, SUM(d.totaldeposit)) FROM Deposits d JOIN d.shop s WHERE s.shopnumber = :number and YEAR(d.date) = :year GROUP BY YEAR(d.date), MONTH(d.date), s.shopnumber ORDER BY YEAR(d.date), MONTH(d.date), s.shopnumber")
    List<CountByIncomeShop> countByIncomeShop(@Param("number") String number,@Param("year")  int year);

}
