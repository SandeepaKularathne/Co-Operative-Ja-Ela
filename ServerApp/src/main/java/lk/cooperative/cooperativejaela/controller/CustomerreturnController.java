package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.dao.CustomerreturnDao;
import lk.cooperative.cooperativejaela.entity.*;
import lk.cooperative.cooperativejaela.entity.Critem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/customerreturns")
public class CustomerreturnController {

    @Autowired
    private CustomerreturnDao customerreturndao;

    @Autowired
    private ItemDao itemdao;

    

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('customer return-select')")
    public List<Customerreturn> get(@RequestParam HashMap<String, String> params) {

        List<Customerreturn> customerreturns = this.customerreturndao.findAll();

        if(params.isEmpty())  return customerreturns;

        String invoiceid= params.get("invoiceid");
        String employeeid= params.get("employeeid");

        Stream<Customerreturn> estream = customerreturns.stream();

        if(invoiceid!=null) estream = estream.filter(e -> e.getInvoice().getId()==Integer.parseInt(invoiceid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));


        return estream.collect(Collectors.toList());

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('customer return-insert')")
    public HashMap<String,String> add(@RequestBody Customerreturn customerreturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors = "";
        if(customerreturn==null)errors = "Empty Customerreturn Item : <br> "+errors;

        System.out.println(customerreturn.getCritems());

        for (Critem critem : customerreturn.getCritems()) {
            critem.setCustomerreturn(customerreturn);
        }

        if(errors==""){

            for (Critem critem : customerreturn.getCritems()) {
                BigDecimal newqty = BigDecimal.ZERO;
                Item item = critem.getItem();

                //BigDecimal qtyToIncrease = critem.getQty();

                List<Critem> oldCritems = customerreturndao.findByCrItemId(customerreturn.getId());
                for (Critem oldcritm : oldCritems){
                    if (oldcritm.getItem().getId()==critem.getItem().getId()){
                        newqty = oldcritm.getQty().subtract(critem.getQty());
                    }
                }

                // Find the existing item or create a new one if not found
                Item existingItem = itemdao.findById(item.getId()).orElse(item);

                // Calculate the updated qty for the item
                BigDecimal increasedQty = existingItem.getQuantity().add(newqty);

                // Update the item's qty and unitprice
                existingItem.setQuantity(increasedQty);

                // Save the item with the updated qty and unitprice
                itemdao.save(existingItem);
            }
            customerreturndao.save(customerreturn);
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(customerreturn.getId()));
        responce.put("url","/customerreturns/"+customerreturn.getId());
        responce.put("errors",errors.toString());

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('customer return-update')")
    public HashMap<String,String> update(@RequestBody Customerreturn customerreturn){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Customerreturn customerreturn1 = customerreturndao.findByMyId(customerreturn.getId());
        if(customerreturn1!=null && customerreturn.getId()!=customerreturn1.getId())
            errors = errors+"<br> CUSTOMERRETURN Not Found";

        for (Critem critem : customerreturn.getCritems()) {
            critem.setCustomerreturn(customerreturn);
        }

        if(errors==""){
            customerreturndao.save(customerreturn);
            for (Critem critem : customerreturn.getCritems()) {
                Item item = critem.getItem();
                BigDecimal qtyToIncrease = critem.getQty();

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

        responce.put("id",String.valueOf(customerreturn.getId()));
        responce.put("url","/customerreturns/"+customerreturn.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('customer return-delete')")
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Customerreturn customerreturnToDelete = customerreturndao.findByMyId(id);

        if(customerreturnToDelete==null)
            errors = errors+"<br> Customerreturn Does Not Existed";

        if (errors.isEmpty()) {
            // Step 2: Get associated Critem records
            Collection<Critem> critems = customerreturnToDelete.getCritems();

            // Step 3: Update Item entities' qty
            for (Critem critem : critems) {
                Item itemToUpdate = critem.getItem();
                BigDecimal currentQty = itemToUpdate.getQuantity();
                BigDecimal critemQty = critem.getQty();
                BigDecimal accQty =currentQty.subtract(critemQty);
                itemToUpdate.setQuantity(accQty);

                // Step 4: Save the updated Item entities to the database
                itemdao.save(itemToUpdate);
            }

            // Step 5: Finally, delete the Customerreturn entity
            customerreturndao.delete(customerreturnToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id",String.valueOf(id));
        responce.put("url","/customerreturns/"+id);
        responce.put("errors",errors);

        return responce;
    }

    @GetMapping(path ="/invre/{id}",produces = "application/json")
    public List<Customerreturn>  filterInvoiceByreq(@PathVariable Integer id) {

        LocalDate localDate = LocalDate.now();
        Date day = Date.valueOf(localDate);

        List<Customerreturn> invs = this.customerreturndao.findShopByReq(id,day);

        invs = invs.stream().map(
                i -> { Customerreturn g = new Customerreturn();
                    g.setId(i.getId());
                    g.setGrandtotal(i.getGrandtotal());
                    return g; }
        ).collect(Collectors.toList());

        return invs ;

    }
}




