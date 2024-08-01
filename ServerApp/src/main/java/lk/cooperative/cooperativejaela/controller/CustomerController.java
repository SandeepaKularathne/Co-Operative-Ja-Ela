package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.CustomerDao;
import lk.cooperative.cooperativejaela.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/customers")
public class CustomerController {

    @Autowired
    private CustomerDao customerdao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('customer registration-select')")
    public List<Customer> get(@RequestParam HashMap<String, String> params) {

        List<Customer> customers = this.customerdao.findAll();

        if(params.isEmpty())  return customers;

        String phonenumber = params.get("phonenumber");
        String genderid= params.get("genderid");
        String loyaltyprogramid= params.get("loyaltyprogramid");

        Stream<Customer> estream = customers.stream();

        if(loyaltyprogramid!=null) estream = estream.filter(e -> e.getLoyaltyprogram().getId()==Integer.parseInt(loyaltyprogramid));
        if(genderid!=null) estream = estream.filter(e -> e.getGender().getId()==Integer.parseInt(genderid));
        if(phonenumber!=null) estream = estream.filter(e -> e.getPhonenumber().equals(phonenumber));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('customer-insert')")
    public HashMap<String,String> add(@RequestBody Customer customer){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(customerdao.findByPhonenumber(customer.getPhonenumber())!=null)
            errors = errors+"<br> Existing Phone Number";

        if(errors=="")
        customerdao.save(customer);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(customer.getId()));
        responce.put("url","/customers/"+customer.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
     @PreAuthorize("hasAuthority('Customer-Update')")
    public HashMap<String,String> update(@RequestBody Customer customer){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Customer emp1 = customerdao.findByPhonenumber(customer.getPhonenumber());

        if(emp1!=null && customer.getId()!=emp1.getId())
            errors = errors+"<br> Existing Phone Number";

        if(errors=="") customerdao.save(customer);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(customer.getId()));
        responce.put("url","/customers/"+customer.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('customer-update')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Customer emp1 = customerdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Customer Does Not Existed";

        if(errors=="") customerdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/customers/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




