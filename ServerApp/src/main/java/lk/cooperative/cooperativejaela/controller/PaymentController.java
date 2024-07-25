package lk.cooperative.cooperativejaela.controller;

import lk.cooperative.cooperativejaela.dao.PaymentDao;
import lk.cooperative.cooperativejaela.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/payments")
public class PaymentController {

    @Autowired
    private PaymentDao paymentdao;

    @GetMapping(produces = "application/json")
//    @PreAuthorize("hasAuthority('payment-select')")
    public List<Payment> get(@RequestParam HashMap<String, String> params) {

        List<Payment> payments = this.paymentdao.findAll();

        if(params.isEmpty())  return payments;

        String ptypeid = params.get("ptypeid");
        String employeeid= params.get("employeeid");

        Stream<Payment> estream = payments.stream();

        if(ptypeid!=null) estream = estream.filter(e -> e.getPtype().getId()==Integer.parseInt(ptypeid));
        if(employeeid!=null) estream = estream.filter(e -> e.getEmployee().getId()==Integer.parseInt(employeeid));


        return estream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Payment-Insert')")
    public HashMap<String,String> add(@RequestBody Payment payment){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(paymentdao.findByPnumber(payment.getPnumber())!=null)
            errors = errors+"<br> Existing Phone Number";

        if(errors=="")
        paymentdao.save(payment);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(payment.getId()));
        responce.put("url","/payments/"+payment.getId());
        responce.put("errors",errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Payment emp1 = paymentdao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Payment Does Not Existed";

        if(errors=="") paymentdao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/payments/"+id);
        responce.put("errors",errors);

        return responce;
    }

}




