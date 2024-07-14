package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.CategoryDao;
import lk.cooperative.cooperativejaela.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/categorys")
public class CategoryController {

    @Autowired
    private CategoryDao categorydao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Category> get() {

        List<Category> categorys = this.categorydao.findAll();

        categorys = categorys.stream().map(
                category -> { Category g = new Category();
                            g.setId(category.getId());
                            g.setName(category.getName());
                            return g; }
        ).collect(Collectors.toList());

        return categorys;

    }

}


