package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByVehiclestatus {

    private Integer id;
    private String vehiclestatus;
    private Long count;
    private double percentage;

    public CountByVehiclestatus() {  }

    public CountByVehiclestatus(String vehiclestatus, Long count) {
        this.vehiclestatus = vehiclestatus;
        this.count = count;
    }

    public String getVehiclestatus() {
        return vehiclestatus;
    }
    public void setVehiclestatus(String vehiclestatus) {
        this.vehiclestatus = vehiclestatus;
    }
    public Long getCount() {
        return count;
    }
    public void setCount(Long count) {
        this.count = count;
    }
    public double getPercentage() {
        return percentage;
    }
    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Id
    public Integer getId() {
        return id;
    }

}
