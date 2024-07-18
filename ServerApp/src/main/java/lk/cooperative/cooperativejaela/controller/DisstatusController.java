package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.DisstatusDao;
import lk.cooperative.cooperativejaela.entity.Disstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/disstatuses")
public class DisstatusController {

    @Autowired
    private DisstatusDao disstatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Disstatus> get() {

        List<Disstatus> disstatuses = this.disstatusdao.findAll();

        disstatuses = disstatuses.stream().map(
                disstatus -> { Disstatus g = new Disstatus();
                            g.setId(disstatus.getId());
                            g.setName(disstatus.getName());
                            return g; }
        ).collect(Collectors.toList());

        return disstatuses;

    }

}


