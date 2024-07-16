package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.GrnDao;
import lk.cooperative.cooperativejaela.entity.Grn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/grns")
public class GrnController {

    @Autowired
    private GrnDao grndao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('grn-select')")
    public List<Grn> get(@RequestParam HashMap<String, String> params) {

        List<Grn> grns = this.grndao.findAll();

        if(params.isEmpty())  return grns;

        String grnstatusid= params.get("grnstatusid");
        String purorderid= params.get("purorderid");

        Stream<Grn> estream = grns.stream();

        if(grnstatusid!=null) estream = estream.filter(e -> e.getGrnstatus().getId()==Integer.parseInt(grnstatusid));
        if(purorderid!=null) estream = estream.filter(e -> e.getPurorder().getId()==Integer.parseInt(purorderid));


        return estream.collect(Collectors.toList());

    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Grn-Insert')")
    public HashMap<String,String> add(@RequestBody Grn grn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(grndao.findById(grn.getId())!=null)
            errors = errors+"<br> Existing Number";

        if(errors=="")
        grndao.save(grn);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(grn.getId()));
        responce.put("url","/grns/"+grn.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Grn-Update')")
    public HashMap<String,String> update(@RequestBody Grn grn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Grn emp1 = grndao.findByMyId(grn.getId());

        if(emp1!=null && grn.getId()!=emp1.getId())
            errors = errors+"<br> Existing Number";

        if(errors=="") grndao.save(grn);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(grn.getId()));
        responce.put("url","/grns/"+grn.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Grn emp1 = grndao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Grn Does Not Existed";

        if(errors=="") grndao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/grns/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




