package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ShopstatusDao;
import lk.cooperative.cooperativejaela.entity.Shopstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/shopstatuses")
public class ShopstatusController {

    @Autowired
    private ShopstatusDao shopstatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Shopstatus> get() {

        List<Shopstatus> shopstatuses = this.shopstatusdao.findAll();

        shopstatuses = shopstatuses.stream().map(
                shopstatus -> { Shopstatus g = new Shopstatus();
                            g.setId(shopstatus.getId());
                            g.setName(shopstatus.getName());
                            return g; }
        ).collect(Collectors.toList());

        return shopstatuses;

    }

}


