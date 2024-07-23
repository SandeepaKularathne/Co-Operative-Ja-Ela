package lk.cooperative.cooperativejaela.report;

import lk.cooperative.cooperativejaela.entity.Employee;
import lk.cooperative.cooperativejaela.report.dao.CountByCRDateDao;
import lk.cooperative.cooperativejaela.report.dao.CountByVehiclestatusDao;
import lk.cooperative.cooperativejaela.report.dao.DashRepDao;
import lk.cooperative.cooperativejaela.report.entity.CountByCRDate;
import lk.cooperative.cooperativejaela.report.entity.CountByVehiclestatus;
import lk.cooperative.cooperativejaela.report.entity.DashRep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired
    private CountByVehiclestatusDao countbyvehiclestatusdao;

    @Autowired
    private CountByCRDateDao countbycrdatedao;

    @Autowired
    private DashRepDao dashrepdao;

    @GetMapping(path ="/countbyvehiclestatus",produces = "application/json")
    public List<CountByVehiclestatus> getvehiclestatus() {

        List<CountByVehiclestatus> vehiclestatuss = this.countbyvehiclestatusdao.countByVehiclestatus();
        long totalCount = 0;

        for (CountByVehiclestatus countByVehiclestatus : vehiclestatuss) {
            totalCount += countByVehiclestatus.getCount();
        }

        for (CountByVehiclestatus countByVehiclestatus : vehiclestatuss) {
            long count = countByVehiclestatus.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByVehiclestatus.setPercentage(percentage);
        }


/*
        long totalCount = vehiclestatuss.stream().mapToLong(CountByVehiclestatus::getCount).sum();

        vehiclestatuss.forEach(vs -> {
            long count = vs.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            vs.setPercentage(percentage);
        });*/

        return vehiclestatuss;
    }

    @GetMapping(path ="/countbycrdate",produces = "application/json")
    public List<CountByCRDate> getcustomerreg(@RequestParam String year) {

        List<CountByCRDate> customerregs = this.countbycrdatedao.countByCRDate(Integer.parseInt(year));
        return customerregs;

    }

    @GetMapping(path ="/dashrep",produces = "application/json")
    public List<DashRep> getdashrep() {

        List<DashRep> dashrep = this.dashrepdao.dashrep();
        return dashrep;

    }
}


