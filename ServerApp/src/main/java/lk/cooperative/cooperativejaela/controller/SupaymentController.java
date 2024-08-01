package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.GrnDao;
import lk.cooperative.cooperativejaela.dao.GrnstatusDao;
import lk.cooperative.cooperativejaela.dao.SupaymentDao;
import lk.cooperative.cooperativejaela.entity.Grn;
import lk.cooperative.cooperativejaela.entity.Supayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/supayments")
public class SupaymentController {

    @Autowired
    private SupaymentDao supaymentdao;

    @Autowired
    private GrnDao grnDao;

    @Autowired
    private GrnstatusDao grnstatusDao;
    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Supayment> get(@RequestParam HashMap<String,String> params) {

        List<Supayment> supayments = this.supaymentdao.findAll();

        if(params.isEmpty()) return supayments;

        String suppayno = params.get("suppayno");
        String pstatusid= params.get("pstatusid");

        Stream<Supayment> itmstream = supayments.stream();

        if(suppayno!=null) itmstream = itmstream.filter( i -> i.getSuppayno().contains(suppayno));
        if(pstatusid!=null) itmstream = itmstream.filter(i -> i.getPstatus().getId()==Integer.parseInt(pstatusid));

        return itmstream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Supayment supayment){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(errors=="") {
            Grn grn = grnDao.findByGrnnumber(supayment.getGrn().getGrnnumber());
            grn.setGrnstatus(grnstatusDao.findByName("Closed"));

            grnDao.save(grn);
            supaymentdao.save(supayment);
        }
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supayment.getId()));
        responce.put("url","/supayments/"+supayment.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Supayment supayment) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supayment itm1 = supaymentdao.findByMyId(supayment.getId());

        if (itm1 != null && supayment.getId() != itm1.getId())
            errors = errors + "<br> Existing Number";


        if (errors == "") supaymentdao.save(supayment);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(supayment.getId()));
        responce.put("url", "/supayments/" + supayment.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supayment itm1 = supaymentdao.findByMyId(id);

        if(itm1==null)
            errors = errors+"<br> Supayment Does Not Existed";

        if(errors=="") supaymentdao.delete(itm1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/supayments/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


