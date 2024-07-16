package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.SubcategoryDao;
import lk.cooperative.cooperativejaela.entity.Subcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/subcategorys")
public class SubcategoryController {

    @Autowired
    private SubcategoryDao subcategorydao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Subcategory> get() {

        List<Subcategory> subcategorys = this.subcategorydao.findAll();

        subcategorys = subcategorys.stream().map(
                subcategory -> { Subcategory g = new Subcategory();
                            g.setId(subcategory.getId());
                            g.setName(subcategory.getName());
                            return g; }
        ).collect(Collectors.toList());

        return subcategorys;

    }

    @GetMapping(path ="/filter/{id}",produces = "application/json")
    public List<Subcategory> filterSubcategory(@PathVariable Integer id) {

        List<Subcategory> subcategorys = this.subcategorydao.findSubcategoryByCategory(id);

        subcategorys = subcategorys.stream().map(
                subcategory -> { Subcategory g = new Subcategory();
                    g.setId(subcategory.getId());
                    g.setName(subcategory.getName());
                    return g; }
        ).collect(Collectors.toList());

        return subcategorys;

    }

}


