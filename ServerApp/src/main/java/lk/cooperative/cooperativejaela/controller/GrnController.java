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
        String errors="";

        // Iterate through the Grnmaterials again to update Material unitprice and qty
//        for (Grnitem grnitem : grn.getGrnitems()) {
//            Item item = grnitem.getItem();
//            Store store = grnitem.getStore();
//            BigDecimal unitCost = grnitem.getUnitcost();
//            BigDecimal qtyToIncrease = BigDecimal.valueOf(grnitem.getQty());
//
//            // Find the existing material or create a new one if not found
//            Item existingItem = itemdao.findById(item.getId()).orElse(item);
//            Store existingStore = storedao.findById(store.getId()).orElse(store);
//
//            // Calculate the updated qty for the material
//            //BigDecimal increasedQty = existingItem.getQuantity().add(qtyToIncrease);
//
//            // Update the material's qty and unitprice
//           // existingMaterial.setQty(increasedQty);
//           // existingMaterial.setUnitprice(unitCost); // Set unitprice as unitcost for simplicity, you can customize the logic here.
//
//            // Save the material with the updated qty and unitprice
//            itemdao.save(existingItem);
//        }
        for (Grnitem grnitems : grn.getGrnitems()) {
            grnitems.setGrn(grn);
        }

        if(errors=="")
        grndao.save(grn);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(grn.getId()));
        responce.put("url","/grns/"+grn.getId());
        responce.put("errors",errors);

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

        Grn emp1 = grndao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Grn Does Not Existed";

        if(errors=="") grndao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/grns/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




