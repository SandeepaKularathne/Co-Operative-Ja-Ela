package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.DisreceiveDao;
import lk.cooperative.cooperativejaela.entity.Disreceive;
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
@RequestMapping(value = "/disreceives")
public class DisreceiveController {

    @Autowired
    private DisreceiveDao disreceivedao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('disreceive-select')")
    public List<Disreceive> get(@RequestParam HashMap<String, String> params) {

        List<Disreceive> disreceives = this.disreceivedao.findAll();

        if(params.isEmpty())  return disreceives;

        String disorderid= params.get("disorderid");
        String employeeid= params.get("employeeid");

        Stream<Disreceive> estream = disreceives.stream();

        if(disorderid!=null) estream = estream.filter(e -> e.getDisorder().getId()==Integer.parseInt(disorderid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Disreceive-Insert')")
    public HashMap<String,String> add(@RequestBody Disreceive disreceive){

        HashMap<String,String> responce = new HashMap<>();
        System.out.println("Disreceive"+disreceive.getEmployee());
        String errors="";

        Optional<Disreceive> existingDisreceive = disreceivedao.findByDisrecnumber(disreceive.getDisrecnumber());
        if (existingDisreceive.isPresent()) {
            errors += "<br> Existing Disreceive Number";
        }

        if(errors == "")
        disreceivedao.save(disreceive);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disreceive.getId()));
        responce.put("url","/disreceives/"+disreceive.getId());
        responce.put("errors",errors);
        System.out.println("responce"+responce);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Disreceive-Update')")
    public HashMap<String,String> update(@RequestBody Disreceive disreceive){

        HashMap<String,String> responce = new HashMap<>();

        String errors="";

        Disreceive emp1 = disreceivedao.findByMyId(disreceive.getId());

        if(errors=="") disreceivedao.save(disreceive);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disreceive.getId()));
        responce.put("url","/disreceives/"+disreceive.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Disreceive emp1 = disreceivedao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Disreceive Does Not Existed";

        if(errors=="") disreceivedao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/disreceives/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




