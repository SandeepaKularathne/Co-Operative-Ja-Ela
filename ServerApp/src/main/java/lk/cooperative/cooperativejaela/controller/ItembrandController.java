package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ItembrandDao;
import lk.cooperative.cooperativejaela.entity.Itembrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/itembrands")
public class ItembrandController {

    @Autowired
    private ItembrandDao itembranddao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Itembrand> get() {

        List<Itembrand> itembrands = this.itembranddao.findAll();

        itembrands = itembrands.stream().map(
                itembrand -> { Itembrand g = new Itembrand();
                            g.setId(itembrand.getId());
                            g.setName(itembrand.getName());
                            return g; }
        ).collect(Collectors.toList());

        return itembrands;

    }

}


