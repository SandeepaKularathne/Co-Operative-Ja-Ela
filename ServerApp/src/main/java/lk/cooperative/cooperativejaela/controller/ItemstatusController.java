package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ItemstatusDao;
import lk.cooperative.cooperativejaela.entity.Itemstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/itemstatuses")
public class ItemstatusController {

    @Autowired
    private ItemstatusDao itemstatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Itemstatus> get() {

        List<Itemstatus> itemstatuss = this.itemstatusdao.findAll();

        itemstatuss = itemstatuss.stream().map(
                itemstatus -> { Itemstatus g = new Itemstatus();
                            g.setId(itemstatus.getId());
                            g.setName(itemstatus.getName());
                            return g; }
        ).collect(Collectors.toList());

        return itemstatuss;

    }

}


