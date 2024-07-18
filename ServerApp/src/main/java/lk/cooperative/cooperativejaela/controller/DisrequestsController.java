package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.DisrequestsDao;
import lk.cooperative.cooperativejaela.entity.Disrequests;
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
@RequestMapping(value = "/disrequestses")
public class DisrequestsController {

    @Autowired
    private DisrequestsDao disrequestsdao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('disrequests-select')")
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
//    @PreAuthorize("hasAuthority('Disrequests-Insert')")
    public HashMap<String,String> add(@RequestBody Disrequests disrequests){

        HashMap<String,String> responce = new HashMap<>();
        System.out.println("Disrequests"+disrequests.getEmployee());
        String errors="";

        Optional<Disrequests> existingDisrequests = disrequestsdao.findByDisnumber(disrequests.getDisnumber());
        if (existingDisrequests.isPresent()) {
            errors += "<br> Existing Disrequests Number";
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
//    @PreAuthorize("hasAuthority('Disrequests-Update')")
    public HashMap<String,String> update(@RequestBody Disrequests disrequests){

        HashMap<String,String> responce = new HashMap<>();

        String errors="";

        Disrequests emp1 = disrequestsdao.findByMyId(disrequests.getId());

        if(errors=="") disrequestsdao.save(disrequests);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disrequests.getId()));
        responce.put("url","/disrequestss/"+disrequests.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
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




