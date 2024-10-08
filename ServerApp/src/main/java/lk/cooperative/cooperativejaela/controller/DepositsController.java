package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.DepositsDao;
import lk.cooperative.cooperativejaela.entity.Deposits;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/depositses")
public class DepositsController {

    @Autowired
    private DepositsDao depositsdao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('income deposits-select')")
    public List<Deposits> get(@RequestParam HashMap<String, String> params) {

        List<Deposits> depositss = this.depositsdao.findAll();

        if(params.isEmpty())  return depositss;

        String shopid= params.get("shopid");
        String employeeid= params.get("employeeid");

        Stream<Deposits> estream = depositss.stream();

        if(shopid!=null) estream = estream.filter(e -> e.getShop().getId()==Integer.parseInt(shopid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('income deposits-insert')")
    public HashMap<String,String> add(@RequestBody Deposits deposits){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";


        // Check if a deposit entry with the same shop ID and date already exists
        Optional<Deposits> existingDeposit = depositsdao.findByDepo(deposits.getShop().getId(), deposits.getDate());

        if (existingDeposit.isPresent()) {
            errors += "<br> Only one deposit allowed per day for the same shop";
        }

        if(errors == "")
        depositsdao.save(deposits);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(deposits.getId()));
        responce.put("url","/depositss/"+deposits.getId());
        responce.put("errors",errors);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('income deposits-update')")
    public HashMap<String,String> update(@RequestBody Deposits deposits){

        HashMap<String,String> responce = new HashMap<>();

        String errors="";

        Deposits emp1 = depositsdao.findByMyId(deposits.getId());

        if(errors=="") depositsdao.save(deposits);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(deposits.getId()));
        responce.put("url","/depositss/"+deposits.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('income deposits-delete')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Deposits emp1 = depositsdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Deposits Does Not Existed";

        if(errors=="") depositsdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/depositss/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




