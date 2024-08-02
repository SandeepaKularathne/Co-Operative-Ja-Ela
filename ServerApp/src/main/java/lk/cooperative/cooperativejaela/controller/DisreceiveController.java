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
@RequestMapping(value = "/disreceives")
public class DisreceiveController {

    @Autowired
    private DisreceiveDao disreceivedao;

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private VehiclestatusDao vehiclestatusDao;

    @Autowired
    private DisrequestsDao disrequestsDao;

    @Autowired
    private DisstatusDao disstatusDao;

    @Autowired
    private DisorderDao disorderDao;

    @Autowired
    private PostatusDao postatusDao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('distribution receives-select')")
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
    @PreAuthorize("hasAuthority('distribution receives-insert')")
    public HashMap<String,String> add(@RequestBody Disreceive disreceive){

        HashMap<String,String> responce = new HashMap<>();
        System.out.println("Disreceive"+disreceive.getEmployee());
        String errors="";

        Optional<Disreceive> existingDisreceive = disreceivedao.findByDisrecnumber(disreceive.getDisrecnumber());
        if (existingDisreceive.isPresent()) {
            errors += "<br> Existing Disreceive Number";
        }

        if(errors == ""){

            Vehicle v = vehicleDao.findByVehiclenumber(disreceive.getDisorder().getVehicle().getNumber());
            //System.out.println(purorder.getPonumber());
            v.setVehiclestatus(vehiclestatusDao.findByName("Free"));
            //System.out.println(purorder.getPostatus());
            vehicleDao.save(v);

            Disrequests d = disrequestsDao.findByNumber(disreceive.getDisorder().getDisrequests().getDisnumber());
            //System.out.println(purorder.getPonumber());
            d.setDisstatus(disstatusDao.findByName("Completed"));
            //System.out.println(purorder.getPostatus());
            disrequestsDao.save(d);

            Disorder o = disorderDao.findByNumber(disreceive.getDisorder().getDisonumber());
            //System.out.println(purorder.getPonumber());
            o.setPostatus(postatusDao.findByName("Closed"));
            //System.out.println(purorder.getPostatus());
            disorderDao.save(o);

            disreceivedao.save(disreceive);
        }
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(disreceive.getId()));
        responce.put("url","/disreceives/"+disreceive.getId());
        responce.put("errors",errors);
        System.out.println("responce"+responce);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('distribution receives-update')")
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
    @PreAuthorize("hasAuthority('distribution receives-delete')")
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




