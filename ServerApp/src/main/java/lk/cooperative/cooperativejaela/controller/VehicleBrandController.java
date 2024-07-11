package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehiclebrandDao;
import lk.cooperative.cooperativejaela.entity.Vehiclebrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehiclebrands")
public class VehicleBrandController {

    @Autowired
    private VehiclebrandDao vehiclebranddao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehiclebrand> get() {

        List<Vehiclebrand> vehiclebrands = this.vehiclebranddao.findAll();

        vehiclebrands = vehiclebrands.stream().map(
                vehiclebrand -> { Vehiclebrand b = new Vehiclebrand();
                    b.setId(vehiclebrand.getId());
                    b.setName(vehiclebrand.getName());
                    return b; }
        ).collect(Collectors.toList());

        return vehiclebrands;

    }

}


