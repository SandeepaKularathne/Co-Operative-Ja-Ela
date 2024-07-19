package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.PurorderDao;
import lk.cooperative.cooperativejaela.entity.Grn;
import lk.cooperative.cooperativejaela.entity.Grnitem;
import lk.cooperative.cooperativejaela.entity.Poitem;
import lk.cooperative.cooperativejaela.entity.Purorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/purorders")
public class PurorderController {

    @Autowired
    private PurorderDao purorderdao;
    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Purorder> get(@RequestParam HashMap<String,String> params) {

        List<Purorder> purorders = this.purorderdao.findAll();

        if(params.isEmpty()) return purorders;

        String id= params.get("id");
        String ponumber = params.get("ponumber");
        String date= params.get("date");
        String postatusid= params.get("postatusid");

        Stream<Purorder> purstream = purorders.stream();

        if(ponumber!=null) purstream = purstream.filter( i -> i.getPonumber().contains(ponumber));
        if(id!=null) purstream = purstream.filter(i -> i.getId()==Integer.parseInt(id));
        if(date!=null) purstream = purstream.filter(i -> i.getDate().equals(date));
        if (postatusid != null) purstream = purstream.filter(i -> i.getPostatus().getId()==Integer.parseInt(postatusid));

        return purstream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Purorder purorder){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Purorder grn1 = purorderdao.findByMyId(purorder.getId());
        if(grn1!=null && purorder.getId()!=grn1.getId())
            errors = errors+"<br> Purorder Not Found";

        for (Poitem poitems : purorder.getPoitems()) {
            poitems.setPurorder(purorder);
        }

        if(errors=="")
            purorderdao.save(purorder);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(purorder.getId()));
        responce.put("url","/purorders/"+purorder.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Purorder purorder) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Purorder itm1 = purorderdao.findByMyId(purorder.getId());
        if (itm1 != null && purorder.getId() != itm1.getId())
            errors = errors + "<br> Existing Number";

        for (Poitem poItem : purorder.getPoitems()) {
            poItem.setPurorder(purorder);
        }

        if (errors == "") purorderdao.save(purorder);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(purorder.getId()));
        responce.put("url", "/purorders/" + purorder.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Purorder itm1 = purorderdao.findByMyId(id);

        if(itm1==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") purorderdao.delete(itm1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/purorders/"+id);
        responce.put("errors",errors);

        return responce;
    }
}


