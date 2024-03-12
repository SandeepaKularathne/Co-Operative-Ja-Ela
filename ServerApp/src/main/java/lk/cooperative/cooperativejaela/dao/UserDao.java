package lk.cooperative.cooperativejaela.dao;


import lk.cooperative.cooperativejaela.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserDao extends JpaRepository<User,Integer> {
    User findByUsername(String username);
}
