package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.RouteDao;
import lk.cooperative.cooperativejaela.entity.Route;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/routes")
public class RouteController {

    @Autowired
    private RouteDao routedao;
    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Route> get(@RequestParam HashMap<String,String> params) {

        List<Route> routes = this.routedao.findAll();

        if(params.isEmpty()) return routes;

        String routenumber = params.get("routenumber");
        String gradeid= params.get("gradeid");

        Stream<Route> routestream = routes.stream();

        if(routenumber!=null) routestream = routestream.filter( i -> i.getRoutenumber().contains(routenumber));
        if(gradeid!=null) routestream = routestream.filter(i -> i.getGrade().getId()==Integer.parseInt(gradeid));

        return routestream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Route route){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(errors=="")
            routedao.save(route);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(route.getId()));
        responce.put("url","/routes/"+route.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Route route) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Route itm1 = routedao.findByMyId(route.getId());

        if (itm1 != null && route.getId() != itm1.getId())
            errors = errors + "<br> Existing Number";


        if (errors == "") routedao.save(route);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(route.getId()));
        responce.put("url", "/routes/" + route.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Route itm1 = routedao.findByMyId(id);

        if(itm1==null)
            errors = errors+"<br> Route Does Not Existed";

        if(errors=="") routedao.delete(itm1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/routes/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


