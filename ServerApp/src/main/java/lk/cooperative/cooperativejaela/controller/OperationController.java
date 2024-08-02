package lk.cooperative.cooperativejaela.controller;


import lk.cooperative.cooperativejaela.entity.Operation;
import lk.cooperative.cooperativejaela.dao.OperationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/operations")
public class OperationController {

    @Autowired
    private OperationDao operationDao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('operations-select')")
    public List<Operation> get(@RequestParam HashMap<String, String> params) {

        List<Operation> operations = this.operationDao.findAll();

        if(params.isEmpty())  return operations;

        String moduleid= params.get("moduleid");

        Stream<Operation> pstream = operations.stream();

        if(moduleid!=null) pstream = pstream.filter(p -> p.getModule().getId()==Integer.parseInt(moduleid));

        return pstream.collect(Collectors.toList());

    }

    @GetMapping(path ="/list", produces = "application/json")
    public List<Operation> get() {

        List<Operation> operations = this.operationDao.findAll();

        operations = operations.stream().map(
                operation -> { Operation op = new Operation();
                    op.setId(operation.getId());
                    op.setName(operation.getName());
                    op.setOpetype(operation.getOpetype());
                    return op; }
        ).collect(Collectors.toList());

        return operations;

    }

    @PostMapping
    @PreAuthorize("hasAuthority('operations-insert')")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Operation operation){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        System.out.println(operation.getName());

        if(errors=="")
            operationDao.save(operation);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(operation.getId()));
        responce.put("url","/operations/"+operation.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @PreAuthorize("hasAuthority('operations-update')")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Operation operation){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(errors=="") operationDao.save(operation);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(operation.getId()));
        responce.put("url","/employees/"+operation.getId());
        responce.put("errors",errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('operations-delete')")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Operation prv = operationDao.findByMyId(id);

        if(prv==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") operationDao.delete(prv);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/operations/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


