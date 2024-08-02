package lk.cooperative.cooperativejaela.report.dao;

import lk.cooperative.cooperativejaela.report.entity.CountByCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByCategoryDao extends JpaRepository<CountByCategory,Integer> {

    @Query("SELECT NEW CountByCategory(c.name, COUNT(s)) FROM Supplier s , Supply su, Category c WHERE s.id = su.supplier.id and c.id = su.category.id GROUP BY c.name")
    List<CountByCategory> countByCategory();


}

