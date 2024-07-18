package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.LoyaltyprogramDao;
import lk.cooperative.cooperativejaela.entity.Loyaltyprogram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/loyaltyprograms")
public class LoyaltyprogramController {

    @Autowired
    private LoyaltyprogramDao loyaltyprogramdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Loyaltyprogram> get() {

        List<Loyaltyprogram> loyaltyprograms = this.loyaltyprogramdao.findAll();

        loyaltyprograms = loyaltyprograms.stream().map(
                loyaltyprogram -> { Loyaltyprogram g = new Loyaltyprogram();
                            g.setId(loyaltyprogram.getId());
                            g.setLevel(loyaltyprogram.getLevel());
                            return g; }
        ).collect(Collectors.toList());

        return loyaltyprograms;

    }

}


