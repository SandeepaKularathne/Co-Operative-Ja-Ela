package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class DashRep {

    @Id
    private Integer id;
    private Double lower;
    private Double upper;

    public DashRep(Double lower, Double upper) {
        this.lower = lower;
        this.upper = upper;
    }

    public DashRep() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getLower() {
        return lower;
    }

    public void setLower(Double lower) {
        this.lower = lower;
    }

    public Double getUpper() {
        return upper;
    }

    public void setUpper(Double upper) {
        this.upper = upper;
    }
}
