package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.SupplierstatusDao;
import lk.cooperative.cooperativejaela.entity.Supplierstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierstatuses")
public class SupplierstatusController {

    @Autowired
    private SupplierstatusDao supplierstatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Supplierstatus> get() {

        List<Supplierstatus> supplierstatuss = this.supplierstatusdao.findAll();

        supplierstatuss = supplierstatuss.stream().map(
                supplierstatus -> { Supplierstatus s = new Supplierstatus();
                            s.setId(supplierstatus.getId());
                            s.setName(supplierstatus.getName());
                            return s; }
        ).collect(Collectors.toList());

        return supplierstatuss;

    }

}


