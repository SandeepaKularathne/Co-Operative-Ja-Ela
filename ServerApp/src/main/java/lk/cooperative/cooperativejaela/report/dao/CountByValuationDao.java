package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByValuation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByValuationDao extends JpaRepository<CountByValuation,Integer> {

    @Query("SELECT new CountByValuation( i.subcategory.name, SUM(i.quantity * i.sprice) )FROM Item i GROUP BY i.subcategory.id")
    List<CountByValuation> countByValuation();

}

