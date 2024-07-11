package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.VehiclestatusDao;
import lk.cooperative.cooperativejaela.entity.Vehiclestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/vehiclestatuses")
public class VehicleStatusController {

    @Autowired
    private VehiclestatusDao vehiclestatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Vehiclestatus> get() {

        List<Vehiclestatus> vehiclestatuses = this.vehiclestatusdao.findAll();

        vehiclestatuses = vehiclestatuses.stream().map(
                vehiclestatus -> { Vehiclestatus s = new Vehiclestatus();
                    s.setId(vehiclestatus.getId());
                    s.setName(vehiclestatus.getName());
                    return s; }
        ).collect(Collectors.toList());

        return vehiclestatuses;

    }

}


