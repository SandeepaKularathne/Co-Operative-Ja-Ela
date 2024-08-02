package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.*;
import lk.cooperative.cooperativejaela.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/supreturns")
public class SupreturnController {

    @Autowired
    private SupreturnDao supreturndao;

    @Autowired
    private ItemDao itemdao;

    @Autowired
    private GrnDao grnDao;

    @Autowired
    private GrnstatusDao grnstatusDao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('supplier return-select')")
    public List<Supreturn> get(@RequestParam HashMap<String, String> params) {

        List<Supreturn> supreturns = this.supreturndao.findAll();

        if(params.isEmpty())  return supreturns;

        String grnid= params.get("grnid");
        String supplierid= params.get("supplierid");

        Stream<Supreturn> estream = supreturns.stream();

        if(grnid!=null) estream = estream.filter(e -> e.getGrn().getId()==Integer.parseInt(grnid));
        if(supplierid!=null) estream = estream.filter(e -> e.getSupplier().getId()==Integer.parseInt(supplierid));


        return estream.collect(Collectors.toList());

    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('supplier return-insert')")
    public HashMap<String,String> add(@RequestBody Supreturn supreturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors = "";
        if(supreturn==null)errors = "Empty Supreturn Item : <br> "+errors;

        for (Supreitem supreitem : supreturn.getSupreitems()) {
            supreitem.setSupreturn(supreturn);
        }

        if(errors==""){
            supreturndao.save(supreturn);
            for (Supreitem supreitem : supreturn.getSupreitems()) {
                Item item = supreitem.getItem();
                BigDecimal qtyToIncrease = BigDecimal.valueOf(supreitem.getQty());

                // Find the existing item or create a new one if not found
                Item existingItem = itemdao.findById(item.getId()).orElse(item);

                // Calculate the updated qty for the item
                BigDecimal increasedQty = existingItem.getQuantity().subtract(qtyToIncrease);

                // Update the item's qty and unitprice
                existingItem.setQuantity(increasedQty);


                // Save the item with the updated qty and unitprice
                itemdao.save(existingItem);

                Grn grn = grnDao.findByGrnnumber(supreturn.getGrn().getGrnnumber());
                grn.setGrnstatus(grnstatusDao.findByName("Return"));
                grnDao.save(grn);
            }
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supreturn.getId()));
        responce.put("url","/supreturns/"+supreturn.getId());
        responce.put("errors",errors.toString());

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('supplier return-update')")
    public HashMap<String,String> update(@RequestBody Supreturn supreturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supreturn supreturn1 = supreturndao.findByMyId(supreturn.getId());
        if(supreturn1!=null && supreturn.getId()!=supreturn1.getId())
            errors = errors+"<br> SUPRETURN Not Found";

        for (Supreitem supreitem : supreturn.getSupreitems()) {
            supreitem.setSupreturn(supreturn);
        }

        if(errors==""){
            supreturndao.save(supreturn);
            for (Supreitem supreitem : supreturn.getSupreitems()) {
                Item item = supreitem.getItem();
                BigDecimal qtyToIncrease = BigDecimal.valueOf(supreitem.getQty());

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

        responce.put("id",String.valueOf(supreturn.getId()));
        responce.put("url","/supreturns/"+supreturn.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('supplier return-delete')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supreturn supreturnToDelete = supreturndao.findByMyId(id);

        if(supreturnToDelete==null)
            errors = errors+"<br> Supreturn Does Not Existed";

        if (errors.isEmpty()) {
            // Step 2: Get associated Supreitem records
            Collection<Supreitem> supreitems = supreturnToDelete.getSupreitems();

            // Step 3: Update Item entities' qty
            for (Supreitem supreitem : supreitems) {
                Item itemToUpdate = supreitem.getItem();
                BigDecimal currentQty = itemToUpdate.getQuantity();
                BigDecimal supreitemQty = BigDecimal.valueOf(supreitem.getQty());
                BigDecimal accQty =currentQty.add(supreitemQty);
                itemToUpdate.setQuantity(accQty);

                // Step 4: Save the updated Item entities to the database
                itemdao.save(itemToUpdate);
            }

            // Step 5: Finally, delete the Supreturn entity
            supreturndao.delete(supreturnToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id",String.valueOf(id));
        responce.put("url","/supreturns/"+id);
        responce.put("errors",errors);

        return responce;
    }

    @GetMapping(path ="/total/{id}",produces = "application/json")
    public List<Supreturn> total(@PathVariable Integer id) {

        List<Supreturn> items = this.supreturndao.findtotal(id);

        items = items.stream().map(
                item -> { Supreturn g = new Supreturn();
                    g.setId(item.getId());
                    g.setGrandtotal(item.getGrandtotal());
                    return g; }
        ).collect(Collectors.toList());

        return items;

    }
}




