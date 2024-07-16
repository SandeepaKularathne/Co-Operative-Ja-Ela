package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubcategoryDao extends JpaRepository<Subcategory,Integer> {

    @Query("select DISTINCT sb from Subcategory sb, Category c where sb.category.id = :id")
    List<Subcategory> findSubcategoryByCategory(@Param("id") Integer id);
}

