package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.DisrequestsDao;
import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.entity.Disitem;
import lk.cooperative.cooperativejaela.entity.Disrequests;
import lk.cooperative.cooperativejaela.entity.Grnitem;
import lk.cooperative.cooperativejaela.entity.Supreitem;
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
@RequestMapping(value = "/disrequestses")
public class DisrequestsController {

    @Autowired
    private DisrequestsDao disrequestsdao;

    @Autowired
    private ItemDao itemdao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('distribution request-select')")
    public List<Disrequests> get(@RequestParam HashMap<String, String> params) {

        List<Disrequests> disrequestss = this.disrequestsdao.findAll();

        if(params.isEmpty())  return disrequestss;

        String disstatusid= params.get("disstatusid");
        String disnumber= params.get("disnumber");

        Stream<Disrequests> estream = disrequestss.stream();

        if(disstatusid!=null) estream = estream.filter(e -> e.getDisstatus().getId()==Integer.parseInt(disstatusid));
        if(disnumber!=null) estream = estream.filter(e -> e.getDisnumber().contains(disnumber));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution request-insert')")
    public HashMap<String,String> add(@RequestBody Disrequests disrequests){

        System.out.println("Received JSON: " + disrequests);

        HashMap<String,String> responce = new HashMap<>();

        String errors = "";
        if (disrequests == null) errors = "Empty Requests Item : <br> " + errors;

        Optional<Disrequests> existingDisrequests = disrequestsdao.findByDisnumber(disrequests.getDisnumber());
        if (existingDisrequests.isPresent()) {
            errors += "<br> Existing Disrequests Number";
        }


            for (Disitem disItem : disrequests.getDisitems()) {
                disItem.setDisrequests(disrequests);
            }


        if(errors == "")
        disrequestsdao.save(disrequests);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disrequests.getId()));
        responce.put("url","/disrequestss/"+disrequests.getId());
        responce.put("errors",errors);
        System.out.println("responce"+responce);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution request-update')")
    public HashMap<String,String> update(@RequestBody Disrequests disrequests){

        HashMap<String,String> responce = new HashMap<>();

        Disrequests disreqitem1 = disrequestsdao.findByMyId(disrequests.getId());

        String errors="";

        if(disreqitem1!=null && disrequests.getId()!=disreqitem1.getId())
            errors = errors+"<br> SUPRETURN Not Found";



        for (Disitem disItem : disrequests.getDisitems()) {
            disItem.setDisrequests(disrequests);
        }

        if(errors=="") disrequestsdao.save(disrequests);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disrequests.getId()));
        responce.put("url","/disrequestss/"+disrequests.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution request-delete')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Disrequests emp1 = disrequestsdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Disrequests Does Not Existed";

        if(errors=="") disrequestsdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/disrequestss/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




