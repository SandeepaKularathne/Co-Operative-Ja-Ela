package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.InvoiceDao;
import lk.cooperative.cooperativejaela.dao.ItemDao;
import lk.cooperative.cooperativejaela.dao.StoreDao;
import lk.cooperative.cooperativejaela.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import java.sql.Date;
import java.time.LocalDate;

@CrossOrigin
@RestController
@RequestMapping(value = "/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceDao invoicedao;

    @Autowired
    private ItemDao itemdao;


    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('invoice-select')")
    public List<Invoice> get(@RequestParam HashMap<String, String> params) {

        List<Invoice> invoices = this.invoicedao.findAll();

        if(params.isEmpty())  return invoices;

        String customerid= params.get("customerid");
        String shopid= params.get("shopid");

        Stream<Invoice> estream = invoices.stream();

        if(customerid!=null) estream = estream.filter(e -> e.getCustomer().getId()==Integer.parseInt(customerid));
        if(shopid!=null) estream = estream.filter(e -> e.getShop().getId()==Integer.parseInt(shopid));


        return estream.collect(Collectors.toList());

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Invoice-Insert')")
    public HashMap<String,String> add(@RequestBody Invoice invoice){

        HashMap<String,String> responce = new HashMap<>();
        String errors = "";
        if(invoice==null)errors = "Empty Invoice Item : <br> "+errors;

        System.out.println(invoice.getIteminvoices());

        for (Iteminvoice iteminvoice : invoice.getIteminvoices()) {
            iteminvoice.setInvoice(invoice);
        }

        if(errors==""){
            invoicedao.save(invoice);
            for (Iteminvoice iteminvoice : invoice.getIteminvoices()) {
                Item item = iteminvoice.getItem();


                BigDecimal qtyTodiscrease = iteminvoice.getQty();

                // Find the existing item or create a new one if not found
                Item existingItem = itemdao.findById(item.getId()).orElse(item);

                // Calculate the updated qty for the item

                BigDecimal discreasedQty = existingItem.getQuantity().subtract(qtyTodiscrease);

                // Update the item's qty and unitprice
                existingItem.setQuantity(discreasedQty);
                
                // Set unitprice as unitcost for simplicity, you can customize the logic here.

                // Save the item with the updated qty and unitprice
                itemdao.save(existingItem);
            }
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(invoice.getId()));
        responce.put("url","/invoices/"+invoice.getId());
        responce.put("errors",errors.toString());

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Invoice invoiceToDelete = invoicedao.findByMyId(id);

        if(invoiceToDelete==null)
            errors = errors+"<br> Invoice Does Not Existed";

        if (errors.isEmpty()) {
            // Step 2: Get associated Iteminvoice records
            Collection<Iteminvoice> iteminvoices = invoiceToDelete.getIteminvoices();

            // Step 3: Update Item entities' qty
            for (Iteminvoice iteminvoice : iteminvoices) {
                Item itemToUpdate = iteminvoice.getItem();

                BigDecimal currentQty = itemToUpdate.getQuantity();
                BigDecimal iteminvoiceQty = iteminvoice.getQty();
                BigDecimal accQty =currentQty.add(iteminvoiceQty);
                itemToUpdate.setQuantity(accQty);

                // Step 4: Save the updated Item entities to the database
                itemdao.save(itemToUpdate);
            }

            // Step 5: Finally, delete the Invoice entity
            invoicedao.delete(invoiceToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id",String.valueOf(id));
        responce.put("url","/invoices/"+id);
        responce.put("errors",errors);

        return responce;
    }

    @GetMapping(path ="/inv/{id}",produces = "application/json")
    public List<Invoice>  filterInvoiceByInv(@PathVariable Integer id) {

        LocalDate localDate = LocalDate.now();
        Date day = Date.valueOf(localDate);

        List<Invoice> invs = this.invoicedao.findShopByInv(id,day);

        invs = invs.stream().map(
                i -> { Invoice g = new Invoice();
                    g.setId(i.getId());
                    g.setGrandtotal(i.getGrandtotal());
                    g.setInvnumber(i.getInvnumber());
                    return g; }
        ).collect(Collectors.toList());

        return invs ;

    }



}




