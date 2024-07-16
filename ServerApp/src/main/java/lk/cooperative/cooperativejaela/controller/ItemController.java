package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/items")
public class ItemController {

    @Autowired
    private ItemDao itemdao;
    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('employee-select')")
    public List<Item> get(@RequestParam HashMap<String,String> params) {

        List<Item> items = this.itemdao.findAll();

        if(params.isEmpty()) return items;

        String name = params.get("name");
        String itemstatusid= params.get("itemstatusid");
        String unittypeid= params.get("unittypeid");
        String categoryid= params.get("categoryid");
        String itembrandid= params.get("itembrandid");

        Stream<Item> itmstream = items.stream();

        if(name!=null) itmstream = itmstream.filter( i -> i.getName().contains(name));
        if(itemstatusid!=null) itmstream = itmstream.filter(i -> i.getItemstatus().getId()==Integer.parseInt(itemstatusid));
        if(unittypeid!=null) itmstream = itmstream.filter(i -> i.getUnittype().getId()==Integer.parseInt(unittypeid));
        if (categoryid != null) itmstream = itmstream.filter(i -> i.getSubcategory().getCategory().getId()==Integer.parseInt(categoryid));
        if(itembrandid!=null) itmstream = itmstream.filter(i -> i.getItembrand().getId()==Integer.parseInt(itembrandid));

        return itmstream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Insert')")
    public HashMap<String,String> add(@RequestBody Item item){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(errors=="")
            itemdao.save(item);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(item.getId()));
        responce.put("url","/items/"+item.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String,String> update(@RequestBody Item item) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Item itm1 = itemdao.findByMyId(item.getId());

        if (itm1 != null && item.getId() != itm1.getId())
            errors = errors + "<br> Existing Number";


        if (errors == "") itemdao.save(item);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(item.getId()));
        responce.put("url", "/items/" + item.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Item itm1 = itemdao.findByMyId(id);

        if(itm1==null)
            errors = errors+"<br> Item Does Not Existed";

        if(errors=="") itemdao.delete(itm1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/items/"+id);
        responce.put("errors",errors);

        return responce;
    }
}


