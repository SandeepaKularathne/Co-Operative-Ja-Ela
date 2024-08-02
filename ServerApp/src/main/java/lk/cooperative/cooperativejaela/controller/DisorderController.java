package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.*;
import lk.cooperative.cooperativejaela.entity.*;
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
@RequestMapping(value = "/disorders")
public class DisorderController {

    @Autowired
    private DisorderDao disorderdao;

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private VehiclestatusDao vehiclestatusDao;

    @Autowired
    private DisrequestsDao disrequestsDao;

    @Autowired
    private DisstatusDao disstatusDao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('distribution order-select')")
    public List<Disorder> get(@RequestParam HashMap<String, String> params) {

        List<Disorder> disorders = this.disorderdao.findAll();

        if(params.isEmpty())  return disorders;

        String postatusid= params.get("postatusid");
        String disonumber= params.get("disonumber");

        Stream<Disorder> estream = disorders.stream();

        if(postatusid!=null) estream = estream.filter(e -> e.getPostatus().getId()==Integer.parseInt(postatusid));
        if(disonumber!=null) estream = estream.filter(e -> e.getDisonumber().contains(disonumber));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution order-insert')")
    public HashMap<String,String> add(@RequestBody Disorder disorder){

        System.out.println("Received JSON: " + disorder.getDisorderitems());

        HashMap<String,String> responce = new HashMap<>();

        String errors = "";
        if (disorder == null) errors = "Empty Requests Item : <br> " + errors;

        Optional<Disorder> existingDisorder = disorderdao.findByDisonumber(disorder.getDisonumber());
        if (existingDisorder.isPresent()) {
            errors += "<br> Existing Disorder Number";
        }

        for (Disorderitem item : disorder.getDisorderitems()) {
                item.setDisorder(disorder);
        }


        if(errors == "") {

            Vehicle v = vehicleDao.findByVehiclenumber(disorder.getVehicle().getNumber());
            //System.out.println(purorder.getPonumber());
            v.setVehiclestatus(vehiclestatusDao.findByName("Loading Truck"));
            //System.out.println(purorder.getPostatus());
            vehicleDao.save(v);

            Disrequests d = disrequestsDao.findByNumber(disorder.getDisrequests().getDisnumber());
            //System.out.println(purorder.getPonumber());
            d.setDisstatus(disstatusDao.findByName("Approved"));
            //System.out.println(purorder.getPostatus());
            disrequestsDao.save(d);


            disorderdao.save(disorder);
        }
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disorder.getId()));
        responce.put("url","/disorders/"+disorder.getId());
        responce.put("errors",errors);
        System.out.println("responce"+responce);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution order-update')")
    public HashMap<String,String> update(@RequestBody Disorder disorder){

        HashMap<String,String> responce = new HashMap<>();

        Disorder disreqitem1 = disorderdao.findByMyId(disorder.getId());

        String errors="";

        if(disreqitem1!=null && disorder.getId()!=disreqitem1.getId())
            errors = errors+"<br> SUPRETURN Not Found";

        for (Disorderitem item : disorder.getDisorderitems()) {
            item.setDisorder(disorder);
        }

        if(errors=="") disorderdao.save(disorder);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disorder.getId()));
        responce.put("url","/disorders/"+disorder.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution order-delete')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Disorder emp1 = disorderdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Disorder Does Not Existed";

        if(errors==""){
            Vehicle v = vehicleDao.findByVehiclenumber(emp1.getVehicle().getNumber());
            //System.out.println(purorder.getPonumber());
            v.setVehiclestatus(vehiclestatusDao.findByName("Free"));
            //System.out.println(purorder.getPostatus());
            vehicleDao.save(v);

            Disrequests d = disrequestsDao.findByNumber(emp1.getDisrequests().getDisnumber());
            //System.out.println(purorder.getPonumber());
            d.setDisstatus(disstatusDao.findByName("Rejected"));
            //System.out.println(purorder.getPostatus());
            disrequestsDao.save(d);
            disorderdao.delete(emp1);
        }
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/disorders/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




