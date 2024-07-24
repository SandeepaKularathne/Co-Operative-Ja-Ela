package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.PtypeDao;
import lk.cooperative.cooperativejaela.entity.Ptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/ptypes")
public class PtypeController {

    @Autowired
    private PtypeDao ptypedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Ptype> get() {

        List<Ptype> ptypes = this.ptypedao.findAll();

        ptypes = ptypes.stream().map(
                ptype -> { Ptype d = new Ptype();
                    d.setId(ptype.getId());
                    d.setName(ptype.getName());
                    return d; }
        ).collect(Collectors.toList());

        return ptypes;

    }

}


