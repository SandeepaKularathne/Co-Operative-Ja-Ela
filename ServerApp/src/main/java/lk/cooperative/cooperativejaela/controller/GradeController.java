package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.GradeDao;
import lk.cooperative.cooperativejaela.entity.Grade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/grades")
public class GradeController {

    @Autowired
    private GradeDao gradedao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Grade> get() {

        List<Grade> grades = this.gradedao.findAll();

        grades = grades.stream().map(
                grade -> { Grade g = new Grade();
                            g.setId(grade.getId());
                            g.setName(grade.getName());
                            return g; }
        ).collect(Collectors.toList());

        return grades;

    }

}


