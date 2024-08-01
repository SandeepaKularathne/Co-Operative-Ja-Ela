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

    @GetMapping(path ="/store", produces = "application/json")
    public HashMap<String, HashMap<String, String>> store() {return RegexProvider.get(new Store());}

    @GetMapping(path ="/shop", produces = "application/json")
    public HashMap<String, HashMap<String, String>> shop() {return RegexProvider.get(new Shop());}

    @GetMapping(path ="/customer", produces = "application/json")
    public HashMap<String, HashMap<String, String>> customer() {return RegexProvider.get(new Customer());}

    @GetMapping(path ="/disrequests", produces = "application/json")
    public HashMap<String, HashMap<String, String>> disrequests() {return RegexProvider.get(new Disrequests());}

    @GetMapping(path ="/supreturn", produces = "application/json")
    public HashMap<String, HashMap<String, String>> supreturn() {return RegexProvider.get(new Supreturn());}

    @GetMapping(path ="/iteminvoice", produces = "application/json")
    public HashMap<String, HashMap<String, String>> iteminvoice() {return RegexProvider.get(new Iteminvoice());}

    @GetMapping(path ="/grnitem", produces = "application/json")
    public HashMap<String, HashMap<String, String>> grnitem() {return RegexProvider.get(new Grnitem());}

    @GetMapping(path ="/route", produces = "application/json")
    public HashMap<String, HashMap<String, String>> route() {return RegexProvider.get(new Route());}

    @GetMapping(path ="/disorder", produces = "application/json")
    public HashMap<String, HashMap<String, String>> disorder() {return RegexProvider.get(new Disorder());}

    @GetMapping(path ="/disorderitem", produces = "application/json")
    public HashMap<String, HashMap<String, String>> disorderitem() {return RegexProvider.get(new Disorderitem());}

    @GetMapping(path ="/disitem", produces = "application/json")
    public HashMap<String, HashMap<String, String>> disitem() {return RegexProvider.get(new Disitem());}

    @GetMapping(path ="/invoice", produces = "application/json")
    public HashMap<String, HashMap<String, String>> invoice() {return RegexProvider.get(new Invoice());}

    @GetMapping(path ="/sritem", produces = "application/json")
    public HashMap<String, HashMap<String, String>> deposits() {return RegexProvider.get(new Deposits());}

    @GetMapping(path ="/deposits", produces = "application/json")
    public HashMap<String, HashMap<String, String>> sritem() {return RegexProvider.get(new Sritem());}
    @GetMapping(path ="/critem", produces = "application/json")
    public HashMap<String, HashMap<String, String>> critem() {return RegexProvider.get(new Critem());}

}


