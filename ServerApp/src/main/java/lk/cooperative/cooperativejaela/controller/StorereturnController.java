package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.StorereturnDao;
import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.entity.Storereturn;
import lk.cooperative.cooperativejaela.entity.Sritem;
import lk.cooperative.cooperativejaela.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/storereturns")
public class StorereturnController {

    @Autowired
    private StorereturnDao storereturndao;

    @Autowired
    private ItemDao itemdao;

    

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('storereturn-select')")
    public List<Storereturn> get(@RequestParam HashMap<String, String> params) {

        List<Storereturn> storereturns = this.storereturndao.findAll();

        if(params.isEmpty())  return storereturns;

        String storeid= params.get("storeid");
        String employeeid= params.get("employeeid");

        Stream<Storereturn> estream = storereturns.stream();

        if(storeid!=null) estream = estream.filter(e -> e.getStore().getId()==Integer.parseInt(storeid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));


        return estream.collect(Collectors.toList());

    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Storereturn-Insert')")
    public HashMap<String,String> add(@RequestBody Storereturn storereturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors = "";
        if(storereturn==null)errors = "Empty Storereturn Item : <br> "+errors;

        for (Sritem sritem : storereturn.getSritems()) {
            sritem.setStorereturn(storereturn);
        }

        if(errors==""){
            storereturndao.save(storereturn);
            for (Sritem sritem : storereturn.getSritems()) {
                Item item = sritem.getItem();

                BigDecimal qtyToIncrease = sritem.getQty();

                // Find the existing item or create a new one if not found
                Item existingItem = itemdao.findById(item.getId()).orElse(item);

                // Calculate the updated qty for the item
                BigDecimal increasedQty = existingItem.getQuantity().subtract(qtyToIncrease);

                // Update the item's qty and unitprice
                existingItem.setQuantity(increasedQty);

                // Save the item with the updated qty and unitprice
                itemdao.save(existingItem);
            }
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(storereturn.getId()));
        responce.put("url","/storereturns/"+storereturn.getId());
        responce.put("errors",errors.toString());

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Storereturn-Update')")
    public HashMap<String,String> update(@RequestBody Storereturn storereturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Storereturn storereturn1 = storereturndao.findByMyId(storereturn.getId());
        if(storereturn1!=null && storereturn.getId()!=storereturn1.getId())
            errors = errors+"<br> STORERETURN Not Found";

        for (Sritem sritem : storereturn.getSritems()) {
            sritem.setStorereturn(storereturn);
        }

        if(errors==""){
            storereturndao.save(storereturn);
            for (Sritem sritem : storereturn.getSritems()) {
                Item item = sritem.getItem();
                BigDecimal qtyToIncrease = sritem.getQty();

                // Find the existing item or create a new one if not found
                Item existingItem = itemdao.findById(item.getId()).orElse(item);

                // Calculate the updated qty for the item
                BigDecimal increasedQty = existingItem.getQuantity().add(qtyToIncrease);

                // Update the item's qty and unitprice
                existingItem.setQuantity(increasedQty);


                // Save the item with the updated qty and unitprice
                itemdao.save(existingItem);
            }
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(storereturn.getId()));
        responce.put("url","/storereturns/"+storereturn.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Storereturn storereturnToDelete = storereturndao.findByMyId(id);

        if(storereturnToDelete==null)
            errors = errors+"<br> Storereturn Does Not Existed";

        if (errors.isEmpty()) {
            // Step 2: Get associated Sritem records
            Collection<Sritem> sritems = storereturnToDelete.getSritems();

            // Step 3: Update Item entities' qty
            for (Sritem sritem : sritems) {
                Item itemToUpdate = sritem.getItem();
                BigDecimal currentQty = itemToUpdate.getQuantity();
                BigDecimal sritemQty = sritem.getQty();
                BigDecimal accQty =currentQty.subtract(sritemQty);
                itemToUpdate.setQuantity(accQty);

                // Step 4: Save the updated Item entities to the database
                itemdao.save(itemToUpdate);
            }

            // Step 5: Finally, delete the Storereturn entity
            storereturndao.delete(storereturnToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id",String.valueOf(id));
        responce.put("url","/storereturns/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




