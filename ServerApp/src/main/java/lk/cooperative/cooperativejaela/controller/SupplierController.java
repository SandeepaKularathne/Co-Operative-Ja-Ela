package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.SupplierDao;
import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliers")
public class SupplierController {

    @Autowired
    private SupplierDao supplierdao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('supplier-select')")
    public List<Supplier> get(@RequestParam HashMap<String, String> params) {

        List<Supplier> suppliers = this.supplierdao.findAll();

        if(params.isEmpty())  return suppliers;

        String registernumber = params.get("registernumber");
        String supplierstypeid= params.get("supplierstypeid");
        String name= params.get("name");
        String supplierstatusid= params.get("supplierstatusid");
        String categoryid= params.get("categoryid");


        Stream<Supplier> estream = suppliers.stream();

        if(supplierstatusid!=null) estream = estream.filter(e -> e.getSupplierstatus().getId()==Integer.parseInt(supplierstatusid));
        if(supplierstypeid!=null) estream = estream.filter(e -> e.getSupplierstype().getId()==Integer.parseInt(supplierstypeid));
        if (categoryid != null) estream = estream.filter(e -> e.getSupplies().stream().anyMatch(s -> s.getCategory().getId() == Integer.parseInt(categoryid)));
        if(registernumber!=null) estream = estream.filter(e -> e.getRegisternumber().equals(registernumber));
        if(name!=null) estream = estream.filter(e -> e.getName().contains(name));

        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Supplier-Insert')")
    public HashMap<String,String> add(@RequestBody Supplier supplier){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(supplierdao.findByRegisternumber(supplier.getRegisternumber())!=null)
            errors = errors+"<br> Existing Number";

        if(errors=="")
        supplierdao.save(supplier);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supplier.getId()));
        responce.put("url","/suppliers/"+supplier.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Supplier-Update')")
    public HashMap<String,String> update(@RequestBody Supplier supplier){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supplier sup1 = supplierdao.findByRegisternumber(supplier.getRegisternumber());
        

        if(sup1!=null && supplier.getId()!=sup1.getId())
            errors = errors+"<br> Existing Registered Number";

        if(errors=="") supplierdao.save(supplier);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supplier.getId()));
        responce.put("url","/suppliers/"+supplier.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supplier sup1 = supplierdao.findByMyId(id);

        if(sup1==null)
            errors = errors+"<br> Supplier Does Not Existed";

        if(errors=="") supplierdao.delete(sup1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/suppliers/"+id);
        responce.put("errors",errors);

        return responce;
    }

    @GetMapping(path ="/grn/{id}",produces = "application/json")
    public List<Supplier> filterSupplierByGrn(@PathVariable Integer id) {

        List<Supplier> s = this.supplierdao.findItemByGrn(id);

        s = s.stream().map(
                i -> { Supplier g = new Supplier();
                    g.setId(i.getId());
                    g.setName(i.getName());
                    return g; }
        ).collect(Collectors.toList());

        return s;

    }

}




