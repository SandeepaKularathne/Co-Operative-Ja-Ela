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

                    "purchaseorder-select","purchaseorder-delete","purchaseorder-update","purchaseorder-insert",
                    "supplierpayment-select","supplierpayment-delete","supplierpayment-update","supplierpayment-insert",
                    "supplierreturn-select","supplierreturn-delete","supplierreturn-update","supplierreturn-insert",
                    "supplier-select","supplier-delete","supplier-update","supplier-insert",

                    "customer-select","customer-delete","customer-update","customer-insert",
                    "customerpayment-select","customerpayment-delete","customerpayment-update","customerpayment-insert",
                    "customerreturn-select","customerreturn-delete","customerreturn-update","customerreturn-insert",
                    "invoice-select","invoice-delete","invoice-update","invoice-insert",
                    "incomedeposits-select","incomedeposits-delete","incomedeposits-update","incomedeposits-insert",

                    "vehicle-select","vehicle-delete","vehicle-update","vehicle-insert",
                    "shop-select","shop-delete","shop-update","shop-insert",
                    "root-select","root-delete","root-update","root-insert",
                    "distributionorder-select","distributionorder-delete","distributionorder-update","distributionorder-insert",
                    "distributionreceives-select","distributionreceives-delete","distributionreceives-update","distributionreceives-insert",
                    "distributionrequest-select","distributionrequest-delete","distributionrequest-update","distributionrequest-insert",

                    "item-select","item-delete","item-update","item-insert",
                    "grn-select","grn-delete","grn-update","grn-insert",
                    "store-select","store-delete","store-update","store-insert",
                    "storereturn-select","storereturn-delete","storereturn-update","storereturn-insert"
            );
        }

        return authorities;
    }
}
