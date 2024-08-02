package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByPostatus {

    private Integer id;
    private String postatus;
    private Long count;
    private double percentage;

    public CountByPostatus() {  }

    public CountByPostatus(String postatus, Long count) {
        this.postatus = postatus;
        this.count = count;
    }

    public String getPostatus() {
        return postatus;
    }
    public void setPostatus(String postatus) {
        this.postatus = postatus;
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
