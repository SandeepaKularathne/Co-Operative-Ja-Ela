package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByShopstatus {

    private Integer id;
    private String shopstatus;
    private Long count;
    private double percentage;

    public CountByShopstatus() {  }

    public CountByShopstatus(String shopstatus, Long count) {
        this.shopstatus = shopstatus;
        this.count = count;
    }

    public String getShopstatus() {
        return shopstatus;
    }
    public void setShopstatus(String shopstatus) {
        this.shopstatus = shopstatus;
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
