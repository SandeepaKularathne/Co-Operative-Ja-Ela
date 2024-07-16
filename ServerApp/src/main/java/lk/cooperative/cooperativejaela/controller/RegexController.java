package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.entity.*;
import lk.cooperative.cooperativejaela.util.RegexProvider;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;



@CrossOrigin
@RestController
@RequestMapping(value = "/regexes")
public class RegexController {

    @GetMapping(path ="/employee", produces = "application/json")
    public HashMap<String, HashMap<String, String>> employee() {
        return RegexProvider.get(new Employee());
    }

    @GetMapping(path ="/users", produces = "application/json")
    public HashMap<String, HashMap<String, String>> user() {
        return RegexProvider.get(new User());
    }

    @GetMapping(path ="/vehicle", produces = "application/json")
    public HashMap<String, HashMap<String, String>> vehicle() {return RegexProvider.get(new Vehicle());}

    @GetMapping(path ="/item", produces = "application/json")
    public HashMap<String, HashMap<String, String>> item() {return RegexProvider.get(new Item());}

    @GetMapping(path ="/supplier", produces = "application/json")
    public HashMap<String, HashMap<String, String>> supplier() {return RegexProvider.get(new Supplier());}

    @GetMapping(path ="/purorder", produces = "application/json")
    public HashMap<String, HashMap<String, String>> purorder() {return RegexProvider.get(new Purorder());}

    @GetMapping(path ="/grn", produces = "application/json")
    public HashMap<String, HashMap<String, String>> grn() {return RegexProvider.get(new Grn());}


}


