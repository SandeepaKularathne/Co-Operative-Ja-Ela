package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByCategory {

    private Integer id;
    private String disstatus;
    private Long count;
    private double percentage;

    public CountByCategory() {  }

    public CountByCategory(String disstatus, Long count) {
        this.disstatus = disstatus;
        this.count = count;
    }

    public String getDisstatus() {
        return disstatus;
    }
    public void setDisstatus(String disstatus) {
        this.disstatus = disstatus;
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
