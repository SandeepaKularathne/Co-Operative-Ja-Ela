package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehicletypeDao;
import lk.cooperative.cooperativejaela.entity.Vehicletype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehicletypes")
public class VehicleTypeController {

    @Autowired
    private VehicletypeDao vehicletypedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehicletype> get() {

        List<Vehicletype> vehicletypes = this.vehicletypedao.findAll();

        vehicletypes = vehicletypes.stream().map(
                vehicletype -> { Vehicletype d = new Vehicletype();
                    d.setId(vehicletype.getId());
                    d.setName(vehicletype.getName());
                    return d; }
        ).collect(Collectors.toList());

        return vehicletypes;

    }

}


