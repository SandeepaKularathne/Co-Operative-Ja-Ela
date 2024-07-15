package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.PostatusDao;
import lk.cooperative.cooperativejaela.entity.Postatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/postatuses")
public class PostatusController {

    @Autowired
    private PostatusDao postatusdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Postatus> get() {

        List<Postatus> postatuss = this.postatusdao.findAll();

        postatuss = postatuss.stream().map(
                postatus -> { Postatus g = new Postatus();
                            g.setId(postatus.getId());
                            g.setName(postatus.getName());
                            return g; }
        ).collect(Collectors.toList());

        return postatuss;

    }

}


