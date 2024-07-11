package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehicleDao;
import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehicles")
public class VehicleController {

    @Autowired
    private VehicleDao vehicledao;
    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Vehicle> get(@RequestParam HashMap<String,String> params) {

        List<Vehicle> vehicles = this.vehicledao.findAll();

        if(params.isEmpty()) return vehicles;

        String number = params.get("number");
        String vehiclestatusid= params.get("vehiclestatusid");
        String vehicletypeid= params.get("vehicletypeid");
        String vehiclemodelid= params.get("vehiclemodelid");
        String vehiclebrandid= params.get("vehiclebrandid");

        Stream<Vehicle> vehistream = vehicles.stream();

        if(number!=null) vehistream = vehistream.filter( v -> v.getNumber().contains(number));
        if(vehiclestatusid!=null) vehistream = vehistream.filter(v -> v.getVehiclestatus().getId()==Integer.parseInt(vehiclestatusid));
        if(vehicletypeid!=null) vehistream = vehistream.filter(v -> v.getVehicletype().getId()==Integer.parseInt(vehicletypeid));
        if(vehiclemodelid!=null) vehistream = vehistream.filter(v -> v.getVehiclemodel().getId()==Integer.parseInt(vehiclemodelid));
        if(vehiclebrandid!=null) vehistream = vehistream.filter(v -> v.getVehiclemodel().getVehiclebrand().getId()==Integer.parseInt(vehiclebrandid));

        return vehistream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Vehicle vehicle){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(vehicledao.findByNumber(vehicle.getNumber())!=null)
            errors = errors+"<br> Existing Number";

        if(errors=="")
            vehicledao.save(vehicle);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(vehicle.getId()));
        responce.put("url","/vehicles/"+vehicle.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Vehicle vehicle) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Vehicle veh1 = vehicledao.findByNumber(vehicle.getNumber());

        if (veh1 != null && vehicle.getId() != veh1.getId())
            errors = errors + "<br> Existing Number";


        if (errors == "") vehicledao.save(vehicle);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(vehicle.getId()));
        responce.put("url", "/vehicles/" + vehicle.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Vehicle veh1 = vehicledao.findByMyId(id);

        if(veh1==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") vehicledao.delete(veh1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/vehicles/"+id);
        responce.put("errors",errors);

        return responce;
    }
}


