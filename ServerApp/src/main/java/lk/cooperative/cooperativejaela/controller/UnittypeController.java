package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.UnittypeDao;
import lk.cooperative.cooperativejaela.entity.Unittype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/unittypes")
public class UnittypeController {

    @Autowired
    private UnittypeDao unittypedao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Unittype> get() {

        List<Unittype> unittypes = this.unittypedao.findAll();

        unittypes = unittypes.stream().map(
                unittype -> { Unittype g = new Unittype();
                            g.setId(unittype.getId());
                            g.setName(unittype.getName());
                            return g; }
        ).collect(Collectors.toList());

        return unittypes;

    }

}


