package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ShopDao;
import lk.cooperative.cooperativejaela.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/shops")
public class ShopController {

    @Autowired
    private ShopDao shopdao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('shop-select')")
    public List<Shop> get(@RequestParam HashMap<String, String> params) {

        List<Shop> shops = this.shopdao.findAll();

        if(params.isEmpty())  return shops;

        String shopstatusid= params.get("shopstatusid");
        String employeeid= params.get("employeeid");

        Stream<Shop> estream = shops.stream();

        if(shopstatusid!=null) estream = estream.filter(e -> e.getShopstatus().getId()==Integer.parseInt(shopstatusid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Shop-Insert')")
    public HashMap<String,String> add(@RequestBody Shop shop){

        HashMap<String,String> responce = new HashMap<>();
        System.out.println("Shop"+shop.getEmployee());
        String errors="";

        Optional<Shop> existingShop = shopdao.findByShopnumber(shop.getShopnumber());
        if (existingShop.isPresent()) {
            errors += "<br> Existing Shop Number";
        }

        if(errors == "")
        shopdao.save(shop);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(shop.getId()));
        responce.put("url","/shops/"+shop.getId());
        responce.put("errors",errors);
        System.out.println("responce"+responce);
        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Shop-Update')")
    public HashMap<String,String> update(@RequestBody Shop shop){

        HashMap<String,String> responce = new HashMap<>();

        String errors="";

        Shop emp1 = shopdao.findByMyId(shop.getId());

        if(errors=="") shopdao.save(shop);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(shop.getId()));
        responce.put("url","/shops/"+shop.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Shop emp1 = shopdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Shop Does Not Existed";

        if(errors=="") shopdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/shops/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




