package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.entity.Privilege;
import lk.cooperative.cooperativejaela.entity.User;
import lk.cooperative.cooperativejaela.dao.UserDao;
import lk.cooperative.cooperativejaela.entity.Userrole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/authorities")
public class UserAuthorityController {

    @Autowired
    private UserDao userdao;

    @GetMapping("/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public List<String> getUserAuthoritiesByUsername(@PathVariable String username) {
        User user = userdao.findByUsername(username);
        List<String> authorities = new ArrayList<>();

        if (user != null){
            List<Userrole> userroles = (List<Userrole>) user.getUserroles();

            for (Userrole u : userroles) {
                List<Privilege> Privileges = (List<Privilege>) u.getRole().getPrivileges();
                for (Privilege p : Privileges) {
                    String authority = p.getAuthority();
                    authorities.add(authority);
                }
            }
        }else{
            authorities = Arrays.asList(
                    "user-select","user-delete","user-update","user-insert",
                    "privilege-select","privilege-delete","privilege-update","privilege-insert",
                    "employee-select","employee-delete","employee-update","employee-insert",
                    "operations-select","operations-delete","operations-update","operations-insert",

                    "purchase order-select","purchase order-delete","purchase order-update","purchase order-insert",
                    "supplier payment-select","supplier payment-delete","supplier payment-update","supplier payment-insert",
                    "supplier return-select","supplier return-delete","supplier return-update","supplier return-insert",
                    "supplier-select","supplier-delete","supplier-update","supplier-insert",

                    "Customer Registration-select","Customer Registration-delete","Customer Registration-update","Customer Registration-insert",
                    "customer payment-select","customer payment-delete","customer payment-update","customer payment-insert",
                    "customer return-select","customer return-delete","customer return-update","customer return-insert",
                    "invoice-select","invoice-delete","invoice-update","invoice-insert",
                    "income deposits-select","income deposits-delete","income deposits-update","income deposits-insert",

                    "vehicle-select","vehicle-delete","vehicle-update","vehicle-insert",
                    "shop-select","shop-delete","shop-update","shop-insert",
                    "root-select","root-delete","root-update","root-insert",
                    "distribution order-select","distribution order-delete","distribution order-update","distribution order-insert",
                    "distribution receives-select","distribution receives-delete","distribution receives-update","distribution receives-insert",
                    "distribution request-select","distribution request-delete","distribution request-update","distribution request-insert",

                    "item-select","item-delete","item-update","item-insert",
                    "Goods Received Note-select","Goods Received Note-delete","Goods Received Note-update","Goods Received Note-insert",
                    "store-select","store-delete","store-update","store-insert",
                    "store return-select","store return-delete","store return-update","store return-insert"
            );
        }

        return authorities;
    }
}
