package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.GrnDao;
import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.dao.StoreDao;
import lk.cooperative.cooperativejaela.entity.Grn;
import lk.cooperative.cooperativejaela.entity.Grnitem;
import lk.cooperative.cooperativejaela.entity.Item;
import lk.cooperative.cooperativejaela.entity.Store;
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
@RequestMapping(value = "/grns")
public class GrnController {

    @Autowired
    private GrnDao grndao;

    @Autowired
    private ItemDao itemdao;

    @Autowired
    private StoreDao storedao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('grn-select')")
    public List<Grn> get(@RequestParam HashMap<String, String> params) {

        List<Grn> grns = this.grndao.findAll();

        if(params.isEmpty())  return grns;

        String grnstatusid= params.get("grnstatusid");
        String purorderid= params.get("purorderid");

        Stream<Grn> estream = grns.stream();

        if(grnstatusid!=null) estream = estream.filter(e -> e.getGrnstatus().getId()==Integer.parseInt(grnstatusid));
        if(purorderid!=null) estream = estream.filter(e -> e.getPurorder().getId()==Integer.parseInt(purorderid));


        return estream.collect(Collectors.toList());

    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Grn-Insert')")
    public HashMap<String,String> add(@RequestBody Grn grn){

        HashMap<String,String> responce = new HashMap<>();
        StringBuilder errors = new StringBuilder();

        for (Grnitem grnItem : grn.getGrnitems()) {
            grnItem.setGrn(grn);
        }

        for (Grnitem grnItem : grn.getGrnitems()) {
            Item item = grnItem.getItem();
            BigDecimal unitCost = grnItem.getUnitcost();
            int qtyToIncrease = grnItem.getQty();

            // Find the existing item or create a new one if not found
            Item existingItem = itemdao.findById(item.getId()).orElse(item);

            // Calculate the updated qty for the item
            int increasedQty = existingItem.getQuantity() + qtyToIncrease;

            // Update the item's qty and unitprice
            existingItem.setQuantity(increasedQty);
            existingItem.setPprice(unitCost); // Set unitprice as unitcost for simplicity, you can customize the logic here.

            // Save the item with the updated qty and unitprice
            itemdao.save(existingItem);
        }



//        for (Grnitem grnitems : grn.getGrnitems()) {
//            grnitems.setGrn(grn);
//        }

//        if(errors=="")
//        grndao.save(grn);
//        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(grn.getId()));
        responce.put("url","/grns/"+grn.getId());
        responce.put("errors",errors.toString());

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Grn-Update')")
    public HashMap<String,String> update(@RequestBody Grn grn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Grn emp1 = grndao.findByMyId(grn.getId());

        if(emp1!=null && grn.getId()!=emp1.getId())
            errors = errors+"<br> Existing Number";

        if(errors=="") grndao.save(grn);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(grn.getId()));
        responce.put("url","/grns/"+grn.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Grn grnToDelete = grndao.findByMyId(id);

        if(grnToDelete==null)
            errors = errors+"<br> Grn Does Not Existed";

        if (errors.isEmpty()) {
            // Step 2: Get associated Grnitem records
            Collection<Grnitem> grnitems = grnToDelete.getGrnitems();

            // Step 3: Update Item entities' qty
            for (Grnitem grnitem : grnitems) {
                Item itemToUpdate = grnitem.getItem();
                int currentQty = itemToUpdate.getQuantity();
                int grnitemQty = grnitem.getQty();
                int accQty =currentQty-grnitemQty;
                itemToUpdate.setQuantity(accQty);

                // Step 4: Save the updated Item entities to the database
                itemdao.save(itemToUpdate);
            }

            // Step 5: Finally, delete the Grn entity
            grndao.delete(grnToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id",String.valueOf(id));
        responce.put("url","/grns/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




