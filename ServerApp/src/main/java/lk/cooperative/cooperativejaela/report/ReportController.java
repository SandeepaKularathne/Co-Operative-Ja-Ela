package lk.cooperative.cooperativejaela.report;

import lk.cooperative.cooperativejaela.report.dao.CountByVehiclestatusDao;
import lk.cooperative.cooperativejaela.report.entity.CountByVehiclestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired
    private CountByVehiclestatusDao countbyvehiclestatusdao;

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

        return vehiclestatuss;
    }
}


