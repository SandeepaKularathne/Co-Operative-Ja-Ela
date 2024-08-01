package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.StoreDao;
import lk.cooperative.cooperativejaela.entity.Store;
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
@RequestMapping(value = "/stores")
public class StoreController {

    @Autowired
    private StoreDao storedao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('store-select')")
    public List<Store> get(@RequestParam HashMap<String, String> params) {

        List<Store> stores = this.storedao.findAll();

        if(params.isEmpty())  return stores;

        String storenumber= params.get("storenumber");
        String employeeid= params.get("employeeid");

        Stream<Store> estream = stores.stream();

        if(storenumber!=null) estream = estream.filter(e -> e.getStorenumber().contains(storenumber));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));

        return estream.collect(Collectors.toList());

    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Store-Insert')")
    public HashMap<String,String> add(@RequestBody Store store){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Optional<Store> existingStore = storedao.findByStorenumber(store.getStorenumber());
        if (existingStore.isPresent()) {
            errors += "<br> Existing Store Number";
        }

        if(errors=="")
        storedao.save(store);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(store.getId()));
        responce.put("url","/stores/"+store.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Store-Update')")
    public HashMap<String,String> update(@RequestBody Store store){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Store emp1 = storedao.findByMyId(store.getId());


        if(errors=="") storedao.save(store);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(store.getId()));
        responce.put("url","/stores/"+store.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Store emp1 = storedao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Store Does Not Existed";

        if(errors=="") storedao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/stores/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




