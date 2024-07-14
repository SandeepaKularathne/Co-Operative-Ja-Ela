package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.SupplierstypeDao;
import lk.cooperative.cooperativejaela.entity.Supplierstype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierstypes")
public class SupplierstypeController {

    @Autowired
    private SupplierstypeDao supplierstypedao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Supplierstype> get() {

        List<Supplierstype> supplierstypes = this.supplierstypedao.findAll();

        supplierstypes = supplierstypes.stream().map(
                supplierstype -> { Supplierstype g = new Supplierstype();
                            g.setId(supplierstype.getId());
                            g.setName(supplierstype.getName());
                            return g; }
        ).collect(Collectors.toList());

        return supplierstypes;

    }

}


