package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehiclemodelDao;
import lk.cooperative.cooperativejaela.entity.Vehiclemodel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehiclemodels")
public class VehicleModelController {

    @Autowired
    private VehiclemodelDao vehiclemodeldao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehiclemodel> get() {

        List<Vehiclemodel> vehiclemodels = this.vehiclemodeldao.findAll();

        vehiclemodels = vehiclemodels.stream().map(
                vehiclemodel -> { Vehiclemodel d = new Vehiclemodel();
                    d.setId(vehiclemodel.getId());
                    d.setName(vehiclemodel.getName());
                    return d; }
        ).collect(Collectors.toList());

        return vehiclemodels;

    }

}


