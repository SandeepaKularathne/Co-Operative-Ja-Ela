package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehiclemodelDao;
import lk.cooperative.cooperativejaela.entity.Vehiclemodel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehiclemodels")
public class VehicleModelController {

    @Autowired
    private VehiclemodelDao vehiclemodeldao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehiclemodel> get(@RequestParam HashMap<String,String>params) {

        List<Vehiclemodel> vehiclemodels = this.vehiclemodeldao.findAll();

        if (params.isEmpty()) return vehiclemodels;

        String brandid = params.get("brandid");
        Stream<Vehiclemodel> vstream = vehiclemodels.stream();

        if (brandid!=null) vstream = vstream.filter(v ->v.getVehiclebrand().getId() == Integer.parseInt(brandid));

        return vstream.collect(Collectors.toList());

    }

}


