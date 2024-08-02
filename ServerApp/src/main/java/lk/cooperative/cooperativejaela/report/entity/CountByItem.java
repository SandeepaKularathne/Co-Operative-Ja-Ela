package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByItem {

    @Id
    private Integer id;
    private String item;
    private Long count;


    public CountByItem() {  }

    public CountByItem(String item, Long count) {
        this.item = item;
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
