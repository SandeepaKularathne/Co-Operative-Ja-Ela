package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehicleDao;
import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Vehicle> get(@RequestParam HashMap<String, String> params) {

        List<Vehicle> employees = this.vehicledao.findAll();

//        if(params.isEmpty())  return employees;
//
//        String number = params.get("number");
//        String genderid= params.get("genderid");
//        String fullname= params.get("fullname");
//        String designationid= params.get("designationid");
//        String nic= paramsarams.get("nic");

        Stream<Vehicle> estream = employees.stream();

//        if(designationid!=null) estream = estream.filter(e -> e.getDesignation().getId()==Integer.parseInt(designationid));
//        if(genderid!=null) estream = estream.filter(e -> e.getGender().getId()==Integer.parseInt(genderid));
//        if(number!=null) estream = estream.filter(e -> e.getNumber().equals(number));
//        if(nic!=null) estream = estream.filter(e -> e.getNic().contains(nic));
//        if(fullname!=null) estream = estream.filter(e -> e.getFullname().contains(fullname));

        return estream.collect(Collectors.toList());

    }
    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehicle> get() {

        List<Vehicle> vehicles = this.vehicledao.findAll();

        vehicles = vehicles.stream().map(
                vehicle -> { Vehicle d = new Vehicle();
                    d.setId(vehicle.getId());
                    d.setNumber(vehicle.getNumber());
                    return d; }
        ).collect(Collectors.toList());

        return vehicles;

    }

}


