package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.PstatusDao;
import lk.cooperative.cooperativejaela.entity.Pstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/pstatuses")
public class PstatusController {

    @Autowired
    private PstatusDao pstatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Pstatus> get() {

        List<Pstatus> pstatuss = this.pstatusdao.findAll();

        pstatuss = pstatuss.stream().map(
                pstatus -> { Pstatus g = new Pstatus();
                            g.setId(pstatus.getId());
                            g.setName(pstatus.getName());
                            return g; }
        ).collect(Collectors.toList());

        return pstatuss;

    }

}


