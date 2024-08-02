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

    @Autowired
    private CountByShopstatusDao countbyshopstatusdao;

    @Autowired
    private ShippingDao shippingDao;

    @Autowired
    private CountByDisstatusDao countbydisstatusdao;

    @Autowired
    private CountByPostatusDao countbypostatusdao;

    @Autowired
    private CountByCategoryDao countbycategorydao;

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

        List<CountByIncomeShop> shops = this.countByIcomeShopdao.countByIncomeShop(shopNumber,Integer.parseInt(year));
        return shops;

    }

    @GetMapping(path ="/valuation",produces = "application/json")
    public List<CountByValuation> getValuation() {

        List<CountByValuation> dashrep = this.countByValuationDao.countByValuation();
        return dashrep;

    }

    @GetMapping(path ="/countbyshopstatus",produces = "application/json")
    public List<CountByShopstatus> getshopstatus() {

        List<CountByShopstatus> shopstatuss = this.countbyshopstatusdao.countByShopstatus();
        long totalCount = 0;

        for (CountByShopstatus countByShopstatus : shopstatuss) {
            totalCount += countByShopstatus.getCount();
        }

        for (CountByShopstatus countByShopstatus : shopstatuss) {
            long count = countByShopstatus.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByShopstatus.setPercentage(percentage);
        }

        return shopstatuss;
    }

    @GetMapping(path ="/shipping",produces = "application/json")
    public List<Shipping> getshop(@RequestParam int id) {

        List<Shipping> shops = this.shippingDao.shipping(id);
        return shops;

    }

    @GetMapping(path ="/countbydisstatus",produces = "application/json")
    public List<CountByDisstatus> getdisstatus() {

        List<CountByDisstatus> disstatuss = this.countbydisstatusdao.countByDisstatus();
        long totalCount = 0;

        for (CountByDisstatus countByDisstatus : disstatuss) {
            totalCount += countByDisstatus.getCount();
        }

        for (CountByDisstatus countByDisstatus : disstatuss) {
            long count = countByDisstatus.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByDisstatus.setPercentage(percentage);
        }

        return disstatuss;
    }

    @GetMapping(path ="/countbypostatus",produces = "application/json")
    public List<CountByPostatus> getpostatus() {

        List<CountByPostatus> postatuss = this.countbypostatusdao.countByPostatus();
        long totalCount = 0;

        for (CountByPostatus countByPostatus : postatuss) {
            totalCount += countByPostatus.getCount();
        }

        for (CountByPostatus countByPostatus : postatuss) {
            long count = countByPostatus.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByPostatus.setPercentage(percentage);
        }

        return postatuss;
    }

    @GetMapping(path ="/countbycategory",produces = "application/json")
    public List<CountByCategory> getcategory() {

        List<CountByCategory> categorys = this.countbycategorydao.countByCategory();
        long totalCount = 0;

        for (CountByCategory countByCategory : categorys) {
            totalCount += countByCategory.getCount();
        }

        for (CountByCategory countByCategory : categorys) {
            long count = countByCategory.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByCategory.setPercentage(percentage);
        }

        return categorys;
    }
}


