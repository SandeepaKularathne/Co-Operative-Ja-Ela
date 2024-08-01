package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.*;
import lk.cooperative.cooperativejaela.entity.*;
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
@RequestMapping(value = "/disorders")
public class DisorderController {

    @Autowired
    private DisorderDao disorderdao;

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private VehiclestatusDao vehiclestatusDao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('disorder-select')")
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
//    @PreAuthorize("hasAuthority('Disorder-Insert')")
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
//    @PreAuthorize("hasAuthority('Disorder-Update')")
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
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Disorder emp1 = disorderdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Disorder Does Not Existed";

        if(errors=="") disorderdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/disorders/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




