package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class CountByValuation {
    @Id
    private Integer id;
    private String name;

    private BigDecimal count;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getCount() {
        return count;
    }

    public void setCount(BigDecimal count) {
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public CountByValuation() {}
    public CountByValuation(String name, BigDecimal count) {
        this.name = name;
        this.count = count;
    }
}
