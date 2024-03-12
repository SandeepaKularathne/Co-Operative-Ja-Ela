package lk.cooperative.cooperativejaela.dao;

import lk.cooperative.cooperativejaela.entity.Userrole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserroleDao extends JpaRepository<Userrole, Integer> {

    Userrole findById(int id);

}
