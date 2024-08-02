package lk.cooperative.cooperativejaela.report;


import lk.cooperative.cooperativejaela.report.dao.*;
import lk.cooperative.cooperativejaela.report.entity.*;
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

    @Autowired
    private CountByIncomeShopDao countByIcomeShopdao;

    @Autowired
    private CountByValuationDao countByValuationDao;

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

    @GetMapping(path ="/countbyshopincome",produces = "application/json")
    public List<CountByIncomeShop> getshop(@RequestParam String shopNumber,String year) {

        System.out.println(shopNumber);

        List<CountByIncomeShop> shops = this.countByIcomeShopdao.countByIncomeShop(shopNumber,Integer.parseInt(year));
        return shops;

    }

    @GetMapping(path ="/valuation",produces = "application/json")
    public List<CountByValuation> getValuation() {

        List<CountByValuation> dashrep = this.countByValuationDao.countByValuation();
        return dashrep;

    }
}


